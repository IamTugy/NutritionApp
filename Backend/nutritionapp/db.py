import motor.motor_asyncio
from bson import UuidRepresentation

# MongoDB setup

class Database():
    def __init__(self):
        client = motor.motor_asyncio.AsyncIOMotorClient(
            "mongodb://root:example@localhost:27017/nutrition_db?authSource=admin",
            uuidRepresentation="standard"
        )
        self.db = client["nutrition_db"]
        self.users = self.db["users"]
        self.foods = self.db["foods"]
        self.snapshots = self.db["snapshots"]
        self.goals = self.db["goals"]
        
database = Database()