"""
Updates the hero image of the break-rent-agreement blog.
Run from backend folder: python scripts/update_blog_image.py
"""
import sys, os, asyncio
from pathlib import Path
from datetime import datetime

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME   = os.environ.get("DB_NAME", "instamakaan")

SLUG = "how-to-break-rent-agreement-early-noida"

# Person reading/reviewing a legal contract document — directly relevant to lease termination
NEW_IMAGE = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?fm=jpg&q=80&w=1400&auto=format&fit=crop"
NEW_IMAGE_THUMB = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?fm=jpg&q=80&w=800&auto=format&fit=crop"

async def main():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    result = await db.blogs.update_one(
        {"slug": SLUG},
        {"$set": {
            "image":     NEW_IMAGE_THUMB,
            "heroImage": NEW_IMAGE,
            "updated_at": datetime.utcnow()
        }}
    )

    if result.matched_count:
        print(f"✅ Image updated for: {SLUG}")
        print(f"   New image: {NEW_IMAGE_THUMB}")
    else:
        print(f"❌ Blog not found with slug: {SLUG}")

    client.close()

if __name__ == "__main__":
    asyncio.run(main())
