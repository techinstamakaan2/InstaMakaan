import asyncio, os, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parent.parent / ".env")
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    client = AsyncIOMotorClient(os.environ["MONGO_URL"])
    db = client[os.environ.get("DB_NAME", "instamakaan")]

    r1 = await db.properties.update_many(
        {"city": "Greater Noida "},
        {"$set": {"city": "Greater Noida"}}
    )
    print(f"Fixed trailing space: {r1.modified_count} properties")

    r2 = await db.properties.update_many(
        {"city": "Greater Noida West"},
        {"$set": {"city": "Greater Noida"}}
    )
    print(f"Fixed 'Greater Noida West' -> 'Greater Noida': {r2.modified_count} properties")

    cities = await db.properties.distinct("city")
    print(f"Cities now: {cities}")
    client.close()

asyncio.run(main())
