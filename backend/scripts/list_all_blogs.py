import sys, os, asyncio, json
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parent.parent / ".env")
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME   = os.environ.get("DB_NAME", "instamakaan")

async def main():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    cursor = db.blogs.find({}, {"title": 1, "slug": 1, "category": 1, "status": 1, "faqs": 1})
    blogs = []
    async for b in cursor:
        blogs.append({
            "title": b.get("title", ""),
            "slug": b.get("slug", ""),
            "category": b.get("category", ""),
            "status": b.get("status", ""),
            "faq_count": len(b.get("faqs", []))
        })
    client.close()
    print(json.dumps(blogs, indent=2))

if __name__ == "__main__":
    asyncio.run(main())
