import motor.motor_asyncio
from bson import UuidRepresentation
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB setup

class Database():
    def __init__(self):
        # Get MongoDB connection details from environment variables
        mongodb_uri = os.getenv("MONGODB_URI", "mongodb://root:example@localhost:27017/nutrition_db?authSource=admin")
        
        client = motor.motor_asyncio.AsyncIOMotorClient(
            mongodb_uri,
            uuidRepresentation="standard"
        )
        self.db = client["nutrition_db"]
        self.users = self.db["users"]
        self.foods = self.db["foods"]
        self.snapshots = self.db["snapshots"]
        self.goals = self.db["goals"]
        self.trainer_user_relationships = self.db["trainer_user_relationships"]
        
database = Database()