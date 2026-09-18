import asyncio
import os
from datetime import datetime, timezone
from uuid import uuid4
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

reels_data = [
    {
        "embed_url": "https://www.instagram.com/reel/DUvhmygkTx3/",
        "thumbnail_url": "/images/instagram/reel-1.jpg",
        "caption": "Noida Move-In Checklist: Avoid rental nightmares before paying any token",
        "has_video": True,
        "order": 1,
        "is_active": True,
    },
    {
        "embed_url": "https://www.instagram.com/reel/DUKRA9TARf8/",
        "thumbnail_url": "/images/instagram/reel-2.jpg",
        "caption": "Golden I, Greater Noida West: Verified flats for rent near D-Mart & Gym",
        "has_video": True,
        "order": 2,
        "is_active": True,
    },
    {
        "embed_url": "https://www.instagram.com/reel/DT74dHVgWgY/",
        "thumbnail_url": "/images/instagram/reel-3.jpg",
        "caption": "Choosing Sukoon: Safer place, real verified homes, zero rental drama",
        "has_video": True,
        "order": 3,
        "is_active": True,
    },
]

async def update_reels():
    client = AsyncIOMotorClient(os.getenv("MONGO_URL"))
    db = client[os.getenv("DB_NAME", "instamakaan")]
    
    # Check existing posts
    existing = await db.instagram_posts.find().sort("order", 1).to_list(100)
    print(f"Found {len(existing)} existing instagram posts in DB.")
    
    # We will clear and insert the 3 official reels
    await db.instagram_posts.delete_many({})
    print("Cleared placeholder instagram posts.")
    
    now = datetime.now(timezone.utc).isoformat()
    to_insert = []
    for r in reels_data:
        r["id"] = str(uuid4())
        r["created_at"] = now
        r["updated_at"] = now
        to_insert.append(r)
        
    await db.instagram_posts.insert_many(to_insert)
    print(f"[SUCCESS] Inserted {len(to_insert)} live Instagram reels with thumbnails.")
    
    # Verify
    all_posts = await db.instagram_posts.find().to_list(100)
    for p in all_posts:
        print(f" - [{p.get('order')}] {p.get('embed_url')} -> {p.get('thumbnail_url')} ({p.get('caption')})")

if __name__ == "__main__":
    asyncio.run(update_reels())
