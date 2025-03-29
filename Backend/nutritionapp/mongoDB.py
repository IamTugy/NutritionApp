from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

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

# Create a unique index on uuid to ensure uniqueness
users_collection.create_index('uuid', unique=True)

# Example of how to insert a user document
def insert_user(uuid, name, email, birthday, phone):
    user_document = {
        'uuid': uuid,
        'name': name,
        'email': email,
        'birthday': birthday,
        'phone': phone
    }
    try:
        result = users_collection.insert_one(user_document)
        return result.inserted_id
    except Exception as e:
        print(f"Error inserting user: {e}")
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
