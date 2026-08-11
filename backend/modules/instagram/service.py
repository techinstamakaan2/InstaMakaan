from datetime import datetime, timezone
from fastapi import HTTPException
from core.database import get_db
from modules.instagram.schemas import InstagramPostCreate, InstagramPostUpdate
from uuid import uuid4


async def create_instagram_post(data: InstagramPostCreate, user: dict):
    db = get_db()
    now = datetime.now(timezone.utc).isoformat()

    clean_url = data.embed_url.split("?")[0].rstrip("/") + "/"

    post = data.model_dump()
    post.update({
        "id": str(uuid4()),
        "embed_url": clean_url,
        "created_at": now,
        "updated_at": now,
    })

    await db.instagram_posts.insert_one(post)
    return post


async def get_instagram_posts(admin: bool = False, page: int = 1, limit: int = 20):
    db = get_db()

    filters = {} if admin else {"is_active": True}
    skip = (page - 1) * limit
    total = await db.instagram_posts.count_documents(filters)

    cursor = db.instagram_posts.find(
        filters, {"_id": 0}
    ).sort([("order", 1), ("created_at", -1)]).skip(skip).limit(limit)

    posts = await cursor.to_list(length=limit)

    return {
        "success": True,
        "page": page,
        "limit": limit,
        "total": total,
        "data": posts,
    }


async def get_instagram_post_by_id(post_id: str):
    db = get_db()
    post = await db.instagram_posts.find_one({"id": post_id}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Instagram post not found")
    return post


async def update_instagram_post(post_id: str, data: InstagramPostUpdate):
    db = get_db()

    existing = await db.instagram_posts.find_one({"id": post_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Instagram post not found")

    update_data = data.model_dump(exclude_unset=True)

    if "embed_url" in update_data:
        update_data["embed_url"] = update_data["embed_url"].split("?")[0].rstrip("/") + "/"

    update_data.pop("id", None)
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    await db.instagram_posts.update_one(
        {"id": post_id},
        {"$set": update_data}
    )

    return await get_instagram_post_by_id(post_id)


async def delete_instagram_post(post_id: str):
    db = get_db()

    existing = await db.instagram_posts.find_one({"id": post_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Instagram post not found")

    await db.instagram_posts.delete_one({"id": post_id})
    return existing