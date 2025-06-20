import asyncio
from datetime import datetime, timezone, timedelta
import uuid
import uvicorn
from fastapi import FastAPI, Query, HTTPException
from typing import List, Optional

from .food_external_api import search_nutrition_item, search_nutrition_items
from .auth0 import get_users as get_auth0_users

from .db import database
from .models import (
    Goals,
    GoalsCreate,
    NutritionItem,
    NutritionSnapshot,
    NutritionSnapshotCreate,
    TrainerUserRelationship,
)

# FastAPI instance
app = FastAPI()


@app.get("/")
def read_root():
    """Basic root endpoint to verify if the app is running."""
    return "Nutrition App"

@app.get("/search", response_model=list[NutritionItem])
async def search_food(query: str):
    """Searches for a food by name."""
    return await search_nutrition_items(query)

@app.get("/users/{user_id}/nutritions", response_model=list[NutritionSnapshot])
async def get_nutrition(
    user_id: str,
    start_date: datetime | None = Query(default_factory=lambda: datetime.now(timezone.utc) - timedelta(days=30)),
    end_date: datetime | None = Query(default_factory=lambda: datetime.now(timezone.utc))
):
    """Fetches nutrition snapshots for a user between a date range."""
    find_attributes = {"user_id": user_id}
    
    # Add date filtering if provided
    if start_date or end_date:
        find_attributes["date"] = {}
        if start_date:
            find_attributes["date"]["$gte"] = start_date.isoformat()
        if end_date:
            find_attributes["date"]["$lte"] = end_date.isoformat()
    
    snapshots = []
    # Sort by date in descending order (newest first)
    async for doc in database.snapshots.find(find_attributes).sort("date", -1):
        print(f"Found snapshot: {doc}")
        # Convert string date back to datetime
        if isinstance(doc.get("date"), str):
            doc["date"] = datetime.fromisoformat(doc["date"])
        # Use MongoDB's _id as the id field
        doc["id"] = uuid.UUID(doc.pop("_id"))
        snapshots.append(NutritionSnapshot(**doc))
    
    print(f"Returning {len(snapshots)} snapshots")
    return snapshots

@app.post("/user/{user_id}/nutritions", response_model=NutritionSnapshot)
async def create_nutrition(user_id: str, snapshot: NutritionSnapshotCreate):
    """Creates a nutrition snapshot for a user."""
    food_data_calls = [search_nutrition_item(item) for item in snapshot.items]
    results = await asyncio.gather(*food_data_calls)
    items = [item for item in results if item is not None]

    snapshot_id = uuid.uuid4()
    new_snapshot = NutritionSnapshot(
            id=snapshot_id,
            user_id=snapshot.user_id or user_id,
            created_by=user_id,
            date=snapshot.date or datetime.now(timezone.utc),
            total_calories=sum(item.calories for item in items),
            items=items,
        )

    # Convert datetime to ISO format string for MongoDB
    snapshot_dict = new_snapshot.model_dump()
    snapshot_dict["date"] = snapshot_dict["date"].isoformat()
    
    # Use the id as MongoDB's _id
    snapshot_dict["_id"] = str(snapshot_dict.pop("id"))
    
    await database.snapshots.insert_one(snapshot_dict)

    return new_snapshot

@app.get("/users/{user_id}/nutritions/{nutrition_id}", response_model=NutritionSnapshot)
async def get_nutrition_by_id(user_id: str, nutrition_id: uuid.UUID):
    """Fetches a specific nutrition snapshot by its ID."""
    snapshot = await database.snapshots.find_one({"_id": str(nutrition_id)})

    if not snapshot:
        return None
    
    return NutritionSnapshot.model_validate(snapshot)

@app.delete("/user/{user_id}/nutritions/{nutrition_id}", response_model=NutritionSnapshot)
async def delete_nutrition(user_id: str, nutrition_id: str):
    """Deletes a nutrition snapshot for a user by its ID."""
    # First find the snapshot to ensure it exists and belongs to the user
    snapshot = await database.snapshots.find_one({
        "_id": nutrition_id,
        "user_id": user_id
    })

    if not snapshot:
        raise HTTPException(status_code=404, detail="Snapshot not found")
    
    # Delete the snapshot
    await database.snapshots.delete_one({
        "_id": nutrition_id,
        "user_id": user_id
    })
    
    # Convert the snapshot to the response model
    if isinstance(snapshot.get("date"), str):
        snapshot["date"] = datetime.fromisoformat(snapshot["date"])
    snapshot["id"] = snapshot.pop("_id")
    
    return NutritionSnapshot(**snapshot)

@app.get("/user/{user_id}/goals", response_model=list[Goals])
async def get_goals(user_id: str):
    """Fetches the goals for a specific user."""
    goals = await database.goals.find_one({"user_id": user_id})

    if not goals:
        return []
    
    return [Goals.model_validate(goals)]

@app.put("/user/{user_id}/goals", response_model=Goals)
async def update_goals(user_id: str, goals: GoalsCreate):
    """Updates the goals for a specific user."""
    # Get existing goal or create new one
    existing_goal = await database.goals.find_one({"user_id": user_id})
    
    if existing_goal:
        # Update only non-empty fields
        update_data = {}
        if goals.total_protein is not None:
            update_data["total_protein"] = goals.total_protein
        if goals.total_water_intake is not None:
            update_data["total_water_intake"] = goals.total_water_intake
        if goals.total_calories is not None:
            update_data["total_calories"] = goals.total_calories
        
        if update_data:
            update_data["updated_at"] = datetime.now(timezone.utc)
            
            await database.goals.update_one(
                {"user_id": user_id},
                {"$set": update_data}
            )
            # Get updated goal
            updated_goal = await database.goals.find_one({"user_id": user_id})
            return Goals.model_validate(updated_goal)
        return Goals.model_validate(existing_goal)
    else:
        # Create new goal if none exists
        goal_id = uuid.uuid4()
        new_goal = Goals(
            id=goal_id,
            user_id=goals.user_id or user_id,
            updated_by=user_id,
            updated_at=datetime.now(timezone.utc),
            total_calories=goals.total_calories,
            total_protein=goals.total_protein,
            total_water_intake=goals.total_water_intake,
        )
        await database.goals.insert_one(new_goal.model_dump())
        return new_goal

@app.get("/user/{user_id}/trainers", response_model=list[TrainerUserRelationship])
async def get_user_trainers(
    user_id: str,
    status: str | None = Query(None, description="Filter by relationship status (pending/active)")
):
    """Gets all trainers for a user with optional status filter."""
    query = {"user_id": user_id}
    if status:
        if status not in ["pending", "active"]:
            raise HTTPException(status_code=400, detail="Invalid status. Must be 'pending' or 'active'")
        query["state"] = status
    
    relationships = []
    async for doc in database.trainer_user_relationships.find(query):
        relationships.append(TrainerUserRelationship.model_validate(doc))
    return relationships

@app.get("/trainer/{trainer_id}/users", response_model=list[TrainerUserRelationship])
async def get_trainer_users(
    trainer_id: str,
    status: str | None = Query(None, description="Filter by relationship status (pending/active)")
):
    """Gets all users for a trainer with optional status filter."""
    query = {"trainer_id": trainer_id}
    if status:
        if status not in ["pending", "active"]:
            raise HTTPException(status_code=400, detail="Invalid status. Must be 'pending' or 'active'")
        query["state"] = status
    
    relationships = []
    async for doc in database.trainer_user_relationships.find(query):
        relationships.append(TrainerUserRelationship.model_validate(doc))
    return relationships

@app.post("/user/{user_id}/connect-trainer/{trainer_id}", response_model=TrainerUserRelationship)
async def connect_to_trainer(user_id: str, trainer_id: str):
    """User initiates a connection request to a trainer."""
    # Check if relationship already exists
    existing = await database.trainer_user_relationships.find_one({
        "trainer_id": trainer_id,
        "user_id": user_id
    })
    
    if existing:
        return TrainerUserRelationship.model_validate(existing)
    # Create new relationship with pending state
    new_relationship = TrainerUserRelationship(
        user_id=user_id,
        trainer_id=trainer_id,
        state="pending"
    )
    
    await database.trainer_user_relationships.insert_one(new_relationship.model_dump())
    return new_relationship

@app.put("/trainer/{trainer_id}/accept-user/{user_id}", response_model=TrainerUserRelationship)
async def accept_user_connection(trainer_id: str, user_id: str):
    """Trainer accepts a user's connection request."""
    # Check if relationship exists and is pending
    existing = await database.trainer_user_relationships.find_one({
        "trainer_id": trainer_id,
        "user_id": user_id,
        "state": "pending"
    })
    
    if not existing:
        raise HTTPException(status_code=404, detail="No pending connection request found")
    
    # Update the relationship to active
    result = await database.trainer_user_relationships.find_one_and_update(
        {"trainer_id": trainer_id, "user_id": user_id},
        {
            "$set": {
                "state": "active",
                "updated_at": datetime.now(timezone.utc)
            }
        },
        return_document=True
    )
    
    return TrainerUserRelationship.model_validate(result)

@app.delete("/user/{user_id}/disconnect-trainer/{trainer_id}")
async def user_disconnect_trainer(user_id: str, trainer_id: str):
    """User disconnects from a trainer."""
    return await trainer_disconnect_user(trainer_id=trainer_id, user_id=user_id)

@app.delete("/trainer/{trainer_id}/disconnect-user/{user_id}")
async def trainer_disconnect_user(trainer_id: str, user_id: str):
    """Trainer disconnects from a user."""
    result = await database.trainer_user_relationships.delete_one({
        "trainer_id": trainer_id,
        "user_id": user_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    return {"message": "Connection removed successfully"}

@app.get("/users", response_model=List[dict])
async def get_users(
    search_query: str | None = Query(None),
    user_ids: List[str] | None = Query(None)
):
    """Fetch users from Auth0 with optional search query or specific user IDs."""
    return await get_auth0_users(search_query, user_ids)

def start():
    """Starts the FastAPI application."""
    uvicorn.run("nutritionapp.main:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    start()
