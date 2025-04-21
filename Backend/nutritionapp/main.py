from datetime import datetime, timezone, timedelta
import uuid
import httpx
from pydantic import BaseModel
import uvicorn
from fastapi import FastAPI, Query, Depends, HTTPException
from .models import (Goals, GoalsCreate, NutritionItem, NutritionSnapshot, NutritionSnapshotCreate)
import motor.motor_asyncio
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from dotenv import load_dotenv
import os
from bson import ObjectId

# key for USDA API
API_KEY = "heBtgvSjYxv2xbeT9bDt0heAYWwAY6qrxXm3JFhx"
BASE_URL = "https://api.nal.usda.gov/fdc/v1/"

# Load environment variables
load_dotenv()

AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
API_AUDIENCE = os.getenv("API_AUDIENCE")
ALGORITHMS = ["RS256"]
from .models import (
    Goals,
    GoalsCreate,
    NutritionItem,
    NutritionSnapshot,
    NutritionSnapshotCreate,
)

# FastAPI instance
app = FastAPI()

# MongoDB setup
client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017")
db = client["nutrition_db"]
users_collection = db["users"]
foods_collection = db["foods"]

# Security
bearer_scheme = HTTPBearer()

class UserCreate(BaseModel):
    """User model for creating a new user."""
    username: str
    email: str
    password: str

class UserInDB(UserCreate):
    """User model with ID for database storage."""
    id: uuid.UUID

class FoodItem(BaseModel):
    """Food item model representing the food and its nutritional information."""
    food_name: str
    calories: float
    protein: float = 0.0
    fat: float = 0.0
    carbohydrates: float = 0.0
    fiber: float = 0.0

def serialize_object_id(obj):
    """Serializes ObjectId to string for JSON response."""
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, dict):
        return {k: serialize_object_id(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [serialize_object_id(item) for item in obj]
    return obj

def serialize_food(food: dict) -> FoodItem:
    """Serializes food document from MongoDB to FoodItem model."""
    food = serialize_object_id(food)
    food.pop("_id", None)
    return FoodItem(**food)

def serialize_goals(goal: dict) -> Goals:
    """Serializes goals document from MongoDB to Goals model."""
    goal = serialize_object_id(goal)
    goal.pop("_id", None)
    return Goals(**goal)

def serialize_nutrition(snapshot: dict) -> NutritionSnapshot:
    """Serializes nutrition snapshot document from MongoDB to NutritionSnapshot model."""
    snapshot = serialize_object_id(snapshot)
    snapshot.pop("_id", None)
    return NutritionSnapshot(**snapshot)

async def get_jwks():
    """Fetches the JWKS (JSON Web Key Set) from Auth0."""
    url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.json()

async def verify_jwt(token: str):
    """Verifies the JWT token using the Auth0 JWKS."""
    jwks = await get_jwks()
    unverified_header = jwt.get_unverified_header(token)
    rsa_key = {}
    for key in jwks["keys"]:
        if key["kid"] == unverified_header["kid"]:
            rsa_key = {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"]
            }
    if not rsa_key:
        raise HTTPException(status_code=401, detail="Missing RSA key")
    try:
        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=ALGORITHMS,
            audience=API_AUDIENCE,
            issuer=f"https://{AUTH0_DOMAIN}/"
        )
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    """Fetch the current user based on the provided JWT token."""
    token = credentials.credentials
    return await verify_jwt(token)
'''
@app.post("/me/foods")
async def add_food(food: FoodItem):
    """Add a food item to the user's history and fetch its nutritional information."""
    user_id = user["sub"]
    
    # Get food nutritional data from the USDA API
    food_data = await get_food_data(food_name)
    
    if not food_data.get('foods'):
        raise HTTPException(status_code=404, detail="Food not found")
    
    food_info = food_data['foods'][0]
    food_nutrients = {item['nutrientName']: item['value'] for item in food_info.get('foodNutrients', [])}
    
    # Add the food item to the user's history
    food_item = {
        "user_id": user_id,
        "food_name": food_info.get('description', 'Unknown'),
        "nutrients": food_nutrients
    }
    result = await foods_collection.insert_one(food_item)
    
    return {"id": str(result.inserted_id), "food_name": food_info.get('description', 'Unknown'), "nutrients": food_nutrients}

@app.get("/me/foods")
async def get_foods(user_id: uuid.UUID):
    foods = []
    total_calories = 0
    total_protein = 0
    total_fat = 0
    total_carbs = 0

    async for food in foods_collection.find({"user_id": str(user_id)}):
        # הדפסת כל המידע כדי לבדוק את הנתונים
        print("Food:", food)

        # עיבוד הנתונים
        food_nutrients = {
            "calories": food.get("calories", 0),
            "protein": food.get("protein", 0),
            "fat": food.get("fat", 0),
            "carbohydrates": food.get("carbohydrates", 0),
            "fiber": food.get("fiber", 0)
        }

        total_calories += food_nutrients["calories"]
        total_protein += food_nutrients["protein"]
        total_fat += food_nutrients["fat"]
        total_carbs += food_nutrients["carbohydrates"]

        foods.append({
            "food_name": food.get("food_name", "Unknown"),
            "nutrients": food_nutrients
        })

    return {
        "foods": foods,
        "total_nutrients": {
            "total_calories": total_calories,
            "total_protein": total_protein,
            "total_fat": total_fat,
            "total_carbs": total_carbs
        }
    }'
    '''

@app.post("/users/{user_id}/foods")
async def add_food(user_id: uuid.UUID, food: FoodItem):
    """Adds a food item for a specific user by their ID, including nutritional information from USDA API."""
    
    food_data = await get_food_data(food.food_name)
    
    if not food_data.get('foods'):
        raise HTTPException(status_code=404, detail="Food not found in USDA database")
    
    food_info = food_data['foods'][0]
    
    food_nutrients = {
        "calories": next((item['value'] for item in food_info.get('foodNutrients', []) if item['nutrientName'] == 'Energy'), 0),
        "protein": next((item['value'] for item in food_info.get('foodNutrients', []) if item['nutrientName'] == 'Protein'), 0),
        "fat": next((item['value'] for item in food_info.get('foodNutrients', []) if item['nutrientName'] == 'Total lipid (fat)'), 0),
        "carbohydrates": next((item['value'] for item in food_info.get('foodNutrients', []) if item['nutrientName'] == 'Carbohydrate, by difference'), 0),
        "fiber": next((item['value'] for item in food_info.get('foodNutrients', []) if item['nutrientName'] == 'Fiber, total dietary'), 0),
    }
    
    food_dict = food.dict()
    food_dict["user_id"] = str(user_id)
    food_dict["nutrients"] = food_nutrients
    
    result = await foods_collection.insert_one(food_dict)
    return {"id": str(result.inserted_id), "food_name": food.food_name, "nutrients": food_nutrients}


@app.get("/users/{user_id}/foods")
async def get_foods(user_id: uuid.UUID):
    """Fetches food items for a specific user by their ID."""
    foods = []
    total_calories = 0
    total_protein = 0
    total_fat = 0
    total_carbs = 0

    async for food in foods_collection.find({"user_id": str(user_id)}):
        print(food)

        food_nutrients = food.get("nutrients", {})

        total_calories += food_nutrients.get("calories", 0)
        total_protein += food_nutrients.get("protein", 0)
        total_fat += food_nutrients.get("fat", 0)
        total_carbs += food_nutrients.get("carbohydrates", 0)

        foods.append({
            "food_name": food.get("food_name", "Unknown"),
            "nutrients": food_nutrients
        })

    return {
        "foods": foods,
        "total_nutrients": {
            "total_calories": total_calories,
            "total_protein": total_protein,
            "total_fat": total_fat,
            "total_carbs": total_carbs
        }
    }



async def get_food_data(query: str):
    """Fetches food data from the USDA API based on the search query."""
    async with httpx.AsyncClient() as client:
        params = {
            "query": query,
            "api_Key": API_KEY
        }
        response = await client.get(f"{BASE_URL}foods/search", params=params)        
        return response.json()
    
"""
@app.get("/search_food/{query}")
async def search_food(query: str):
    food_data = await get_food_data(query)
    if food_data.get('foods'):
        food_info = food_data['foods'][0]
        food_name = food_info.get('description', 'Unknown')
        nutrients = {
            item['nutrientName']: item['value']
            for item in food_info.get('foodNutrients', [])
        }
        return {
            "food_name": food_name,
            "nutrients": nutrients
        }
    return {"message": "Food not found"}
"""

@app.get("/")
def read_root():
    """Basic root endpoint to verify if the app is running."""
    return "Nutrition App"

@app.get("/users/{user_id}/nutritios", response_model=list[NutritionSnapshot])
async def get_nutrition(
    user_id: uuid.UUID,
    start_date: datetime | None = Query(default_factory=lambda: datetime.now(timezone.utc) - timedelta(days=30)),
    end_date: datetime | None = Query(default_factory=lambda: datetime.now(timezone.utc))
):
    """Fetches nutrition snapshots for a user between a date range."""
    cursor = db["snapshots"].find({
        "user_id": str(user_id),
        "date": {"$gte": start_date, "$lte": end_date}
    })
    snapshots = []
    async for doc in cursor:
        snapshots.append(serialize_nutrition(doc))
    return snapshots

@app.post("/user/{user_id}/nutritions", response_model=NutritionSnapshot)
async def create_nutrition(user_id: uuid.UUID, snapshot: NutritionSnapshotCreate):
    """Creates a nutrition snapshot for a user."""
    snapshot_data = snapshot.dict()
    snapshot_data["user_id"] = str(user_id)
    snapshot_data["date"] = datetime.now(timezone.utc)
    snapshot_data["total_calories"] = len(snapshot.items) * 100
    result = await db["snapshots"].insert_one(snapshot_data)
    snapshot_data["id"] = str(result.inserted_id)
    return serialize_nutrition(snapshot_data)

@app.get("/users/{user_id}/nutritions/{nutrition_id}", response_model=NutritionSnapshot)
async def get_nutrition_by_id(user_id: uuid.UUID, nutrition_id: uuid.UUID):
    """Fetches a specific nutrition snapshot by its ID."""
    snapshot = await db["snapshots"].find_one({"_id": nutrition_id})
    if not snapshot:
        raise HTTPException(status_code=404, detail="Snapshot not found")
    return serialize_nutrition(snapshot)

@app.delete("/user/{user_id}/nutritions/{nutrition_id}", response_model=NutritionSnapshot)
async def delete_nutrition(user_id: uuid.UUID, nutrition_id: uuid.UUID):
    """Deletes a nutrition snapshot for a user by its ID."""
    snapshot = await db["snapshots"].find_one_and_delete({"_id": nutrition_id})
    if not snapshot:
        raise HTTPException(status_code=404, detail="Snapshot not found")
    return serialize_nutrition(snapshot)

@app.get("/user/{user_id}/goals", response_model=Goals)
async def get_goals(user_id: uuid.UUID):
    """Fetches the goals for a specific user."""
    goal = await db["goals"].find_one({"user_id": str(user_id)})
    if not goal:
        raise HTTPException(status_code=404, detail="Goals not found")
    return serialize_goals(goal)

@app.put("/user/{user_id}/goals", response_model=Goals)
async def update_goals(user_id: uuid.UUID, goals: GoalsCreate):
    """Updates the goals for a specific user."""
    goal_dict = goals.dict()
    goal_dict["user_id"] = str(user_id)
    goal_dict["updated_at"] = datetime.now(timezone.utc)
    await db["goals"].replace_one({"user_id": str(user_id)}, goal_dict, upsert=True)
    return serialize_goals(goal_dict)

def start():
    """Starts the FastAPI application."""
    uvicorn.run("nutritionapp.main:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    start()
