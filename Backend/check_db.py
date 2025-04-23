import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from pprint import pprint

async def check_database():
    # Use the same connection string as in the application
    client = AsyncIOMotorClient("mongodb://root:example@localhost:27017/")
    db = client.nutrition_db
    
    # List all collections
    collections = await db.list_collection_names()
    print("\nCollections in the database:")
    print("----------------------------")
    for collection in collections:
        print(f"- {collection}")
        
        # Get count of documents in each collection
        count = await db[collection].count_documents({})
        print(f"  Document count: {count}")
        
        # Show a sample document if collection is not empty
        if count > 0:
            print("  Sample document:")
            sample_doc = await db[collection].find_one()
            pprint(sample_doc, indent=4)
        print()

async def main():
    try:
        await check_database()
    except Exception as e:
        print(f"Error connecting to database: {e}")

if __name__ == "__main__":
    asyncio.run(main()) 