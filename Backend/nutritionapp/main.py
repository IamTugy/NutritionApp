import asyncio
from datetime import datetime, timezone, timedelta
import uuid
import uvicorn
from fastapi import FastAPI, Query, HTTPException

from .food_external_api import search_nutrition_item, search_nutrition_items

from .db import database
from .models import (
    Goals,
    GoalsCreate,
    NutritionItem,
    NutritionSnapshot,
    NutritionSnapshotCreate,
)
from dotenv import load_dotenv


# Load environment variables
load_dotenv()

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
    
    print(f"Query attributes: {find_attributes}")
    
    snapshots = []
    async for doc in database.snapshots.find(find_attributes):
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
            date=datetime.now(timezone.utc),
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
        raise HTTPException(status_code=404, detail="Snapshot not found")
    
    return NutritionSnapshot.model_validate(snapshot)

@app.delete("/user/{user_id}/nutritions/{nutrition_id}", response_model=NutritionSnapshot)
async def delete_nutrition(user_id: str, nutrition_id: uuid.UUID):
    """Deletes a nutrition snapshot for a user by its ID."""
    snapshot = await database.snapshots.find_one_and_delete({"_id": str(nutrition_id)})

    if not snapshot:
        raise HTTPException(status_code=404, detail="Snapshot not found")
    
    return NutritionSnapshot.model_validate(snapshot)

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
    goal_id = uuid.uuid4()
    new_goal = Goals(
        id=goal_id,
        user_id=goals.user_id or user_id,
        updated_at=datetime.now(timezone.utc),
        total_calories=goals.total_calories,
    )
    await database.goals.replace_one({"user_id": user_id}, new_goal.model_dump(), upsert=True)
    return new_goal

def start():
    """Starts the FastAPI application."""
    uvicorn.run("nutritionapp.main:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    start()
