import asyncio
import os
import sys
from pathlib import Path

# Add backend root to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")
from motor.motor_asyncio import AsyncIOMotorClient


async def main():
    mongo_url = os.environ.get("MONGO_URL")
    if not mongo_url:
        print("MONGO_URL not found in environment!")
        return

    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ.get("DB_NAME", "instamakaan")]

    # Find all rental properties where move_charge is not set or null
    filter_query = {
        "property_type": {"$ne": "buy"},
        "$or": [
            {"move_charge": {"$exists": False}},
            {"move_charge": None},
            {"move_charge": ""},
        ],
    }

    count_matching = await db.properties.count_documents(filter_query)
    print(f"Found {count_matching} rental properties needing move_charge update.")

    if count_matching > 0:
        result = await db.properties.update_many(
            filter_query,
            {"$set": {"move_charge": "3000"}},
        )
        print(f"Successfully updated {result.modified_count} rental properties with move_charge='3000'.")
    else:
        print("All rental properties already have move_charge set.")

    # Inspect current state
    async for prop in db.properties.find({"property_type": {"$ne": "buy"}}, {"title": 1, "move_charge": 1, "_id": 0}):
        print(f"Property: '{prop.get('title')}' -> move_charge: {prop.get('move_charge')}")

    client.close()


if __name__ == "__main__":
    asyncio.run(main())
