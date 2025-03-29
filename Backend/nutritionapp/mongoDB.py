from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import datetime

uri = "mongodb+srv://nirregen:tQgOjLXsDniwO6Q9@db.kbxwtgd.mongodb.net/?retryWrites=true&w=majority&appName=DB"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

# Create/access the database and collection
db = client['nutrition_app']
users_collection = db['users']
food_entries_collection = db['food_entries']

# Create a unique index on uuid to ensure uniqueness
users_collection.create_index('uuid', unique=True)

# Example of how to insert a user document
def insert_user(uuid, name, email, age, phone, goal):
    user_document = {
        'uuid': uuid,
        'name': name,
        'email': email,
        'age': age,
        'phone': phone,
        'goal': goal
    }
    try:
        result = users_collection.insert_one(user_document)
        return result.inserted_id
    except Exception as e:
        print(f"Error inserting user: {e}")
        return None

def get_total_calories(uuid):
    try:
        pipeline = [
            {"$match": {"uuid": uuid}},
            {"$group": {"_id": "$uuid", "total": {"$sum": "$calories"}}}
        ]
        result = food_entries_collection.aggregate(pipeline)
        total = next(result, {"total": 0})["total"]
        return total
    except Exception as e:
        print(f"Error calculating total calories: {e}")
        return 0

def insert_food_entry(uuid, food, calories, timestamp=None):
    food_document = {
        'uuid': uuid,
        'food': food,
        'calories': calories,
        'timestamp': timestamp if timestamp else datetime.datetime.now(),
        'total_calories': get_total_calories(uuid) + calories
    }
    try:
        result = food_entries_collection.insert_one(food_document)
        return result.inserted_id
    except Exception as e:
        print(f"Error inserting food entry: {e}")
        return None


# Example usage
user_id = insert_user(
    uuid="12345-67890",
    name="John Doe",
    email="john@example.com",
    birthday="1990-01-01",
    phone="+1234567890"
)

print(f"User inserted with ID: {user_id}")

# Example usage
food_entry_id = insert_food_entry(
    uuid="12345-67890",
    food="Apple",
    calories=95,
    timestamp=datetime.datetime(2025, 3, 29, 12, 0, 0),
)

print(f"Food entry inserted with ID: {food_entry_id}")