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
def insert_user(uuid, name, email, age, phone, goal, is_coach, coach_uuid=None, coached_users=None):
    # First check if user already exists
    existing_user = users_collection.find_one({'uuid': uuid})
    if existing_user:
        print(f"User with UUID {uuid} already exists!")
        return None
    
    try:
        # Convert goal to integer
        goal = int(goal)
        
        user_document = {
            'uuid': uuid,
            'name': name,
            'email': email,
            'age': age,
            'phone': phone,
            'goal': goal,
            'is_coach': is_coach,
            'coach_data': coached_users if is_coach else coach_uuid
        }
        result = users_collection.insert_one(user_document)
        print(f"Successfully created new user with UUID: {uuid}")
        return result.inserted_id
    except ValueError:
        print("Error: Goal must be a valid number")
        return None
    except Exception as e:
        print(f"Error inserting user: {e}")
        return None

def get_daily_calories(uuid, date=None):
    try:
        target_date = date if date else datetime.datetime.now()
        start_of_day = datetime.datetime(target_date.year, target_date.month, target_date.day)
        end_of_day = start_of_day + datetime.timedelta(days=1)
        
        pipeline = [
            {
                "$match": {
                    "uuid": uuid,
                    "timestamp": {
                        "$gte": start_of_day,
                        "$lt": end_of_day
                    }
                }
            },
            {
                "$group": {
                    "_id": None,
                    "total": {"$sum": "$calories"}
                }
            }
        ]
        result = food_entries_collection.aggregate(pipeline)
        daily_total = next(result, {"total": 0})["total"]
        return daily_total
    except Exception as e:
        print(f"Error calculating daily calories: {e}")
        return 0

def get_last_entries(uuid, limit=50):
    try:
        entries = food_entries_collection.find(
            {"uuid": uuid},
            {"food": 1, "calories": 1, "timestamp": 1, "_id": 0}
        ).sort("timestamp", -1).limit(limit)
        return list(entries)
    except Exception as e:
        print(f"Error getting last {limit} entries: {e}")
        return []


def insert_food_entry(uuid, food, calories, timestamp=None):
    food_document = {
        'uuid': uuid,
        'food': food,
        'calories': calories,
        'timestamp': timestamp if timestamp else datetime.datetime.now()
    }
    try:
        result = food_entries_collection.insert_one(food_document)
        return result.inserted_id
    except Exception as e:
        print(f"Error inserting food entry: {e}")
        return None

def update_user_goal(uuid, new_goal):
    try:
        # Convert goal to integer to ensure it's a number
        new_goal = int(new_goal)
        result = users_collection.update_one(
            {'uuid': uuid},
            {'$set': {'goal': new_goal}}
        )
        if result.matched_count == 0:
            print(f"No user found with UUID: {uuid}")
            return False
        print(f"Successfully updated goal to {new_goal} calories for user: {uuid}")
        return True
    except ValueError:
        print("Error: Goal must be a valid number")
        return False
    except Exception as e:
        print(f"Error updating user goal: {e}")
        return False

# # Example usage
# user_id = insert_user(
#     uuid="12345-67891",
#     name="John Doe",
#     email="john@example.com",
#     age=20,
#     phone="+1234567890",
#     goal="weight_loss",
#     is_coach=False,
#     coach_uuid="coach-uuid-123"
# )

# print(f"User inserted with ID: {user_id}")

# # Example usage
# food_entry_id = insert_food_entry(
#     uuid="12345-67890",
#     food="banana",
#     calories=100,
#     timestamp=datetime.datetime(2025, 3, 29, 12, 0, 0),
    
# )

# print(f"Food entry inserted with ID: {food_entry_id}")

# # For a coach
# coach_id = insert_user(
#     uuid="coach-uuid-123",
#     name="Coach Smith",
#     email="coach@example.com",
#     age=35,
#     phone="+1987654321",
#     goal="help_others",
#     is_coach=True,
#     coached_users=["12345-67891", "12345-67890"]
# )
# daily_totals = get_daily_calories("12345-67890")
# print(daily_totals)
# last_50_entries = get_last_entries("12345-67890")
# print(last_50_entries)
update_user_goal("12345-67891", 2000)
