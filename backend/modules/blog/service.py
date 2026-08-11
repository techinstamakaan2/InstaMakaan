import os
import io
from bson import ObjectId
from datetime import datetime
from fastapi import UploadFile
from core.database import get_db

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_SIZE_MB = 10


def _serialize(doc) -> dict:
    if doc is None:
        return None
    doc["_id"] = str(doc["_id"])
    return doc


# ── image upload → Cloudinary (permanent, CDN-backed) ─────────────────────────
async def save_upload(file: UploadFile) -> str:
    """Upload image to Cloudinary and return the permanent CDN URL."""
    import cloudinary
    import cloudinary.uploader

    cloudinary_url = os.getenv("CLOUDINARY_URL", "")
    if not cloudinary_url:
        raise ValueError("CLOUDINARY_URL is not set. Add it to your .env file.")

    cloudinary.config(cloudinary_url=cloudinary_url)

    if file.content_type not in ALLOWED_TYPES:
        raise ValueError(f"Unsupported file type: {file.content_type}")

    contents = await file.read()
    if len(contents) > MAX_SIZE_MB * 1024 * 1024:
        raise ValueError(f"File exceeds {MAX_SIZE_MB}MB limit")

    result = cloudinary.uploader.upload(
        io.BytesIO(contents),
        folder="instamakaan/blogs",
        resource_type="image",
        format="webp",
        quality="auto:good",
    )
    return result["secure_url"]


# ── normalize hero image field ────────────────────────────────────────────────
def _resolve_image(data: dict) -> dict:
    """Ensure `image` field is set (prefer heroImage if image is empty)."""
    hero = data.pop("heroImage", None)
    if not data.get("image") and hero:
        data["image"] = hero
    return data


# ── blog CRUD ─────────────────────────────────────────────────────────────────
async def get_all_blogs(category=None, search=None, status=None, limit=None, exclude=None):
    db = get_db()
    collection = db["blogs"]
    query = {}

    if status and status != "all":
        query["status"] = status
    if category and category not in ("All Posts", "All"):
        query["category"] = category
    if search:
        query["$or"] = [
            {"title":       {"$regex": search, "$options": "i"}},
            {"excerpt":     {"$regex": search, "$options": "i"}},
            {"author.name": {"$regex": search, "$options": "i"}},
        ]
    if exclude:
        try:
            query["_id"] = {"$ne": ObjectId(exclude)}
        except Exception:
            pass

    cursor = collection.find(query).sort([("order", 1), ("created_at", -1)])
    if limit:
        cursor = cursor.limit(limit)

    return [_serialize(doc) async for doc in cursor]


async def get_blog_by_slug(slug: str):
    db = get_db()
    collection = db["blogs"]
    doc = await collection.find_one({"slug": slug})
    if doc:
        await collection.update_one({"_id": doc["_id"]}, {"$inc": {"views": 1}})
        doc["views"] = doc.get("views", 0) + 1
    return _serialize(doc)


async def get_blog_by_id(blog_id: str):
    db = get_db()
    collection = db["blogs"]
    try:
        doc = await collection.find_one({"_id": ObjectId(blog_id)})
    except Exception:
        return None
    if doc:
        await collection.update_one({"_id": ObjectId(blog_id)}, {"$inc": {"views": 1}})
        doc["views"] = doc.get("views", 0) + 1
    return _serialize(doc)


async def create_blog(data: dict):
    db = get_db()
    collection = db["blogs"]
    data = _resolve_image(data)
    # auto-generate slug from title if not provided
    if not data.get("slug") and data.get("title"):
        import re
        data["slug"] = re.sub(r'\s+', '-', re.sub(r'[^a-z0-9\s-]', '', data["title"].lower().strip()))
    data["created_at"] = datetime.utcnow()
    data["updated_at"] = datetime.utcnow()
    data.setdefault("views", 0)
    data.setdefault("status", "draft")
    data.setdefault("tags", [])
    data.setdefault("blocks", [])
    if data.get("order") is None:
        # new posts go to the end of the list by default, not the top
        data["order"] = await collection.count_documents({})
    result = await collection.insert_one(data)
    created = await collection.find_one({"_id": result.inserted_id})
    return _serialize(created)


async def update_blog(blog_id: str, data: dict):
    db = get_db()
    collection = db["blogs"]
    data = _resolve_image(data)
    data["updated_at"] = datetime.utcnow()
    clean = {k: v for k, v in data.items() if v is not None}
    try:
        await collection.update_one({"_id": ObjectId(blog_id)}, {"$set": clean})
        updated = await collection.find_one({"_id": ObjectId(blog_id)})
        return _serialize(updated)
    except Exception:
        return None


async def get_comments(blog_id: str):
    db = get_db()
    cursor = db["blog_comments"].find({"blog_id": blog_id}).sort("created_at", 1)
    docs = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        docs.append(doc)
    return docs


async def add_comment(blog_id: str, name: str, text: str):
    db = get_db()
    doc = {
        "blog_id": blog_id,
        "name": name.strip(),
        "text": text.strip(),
        "created_at": datetime.utcnow(),
    }
    result = await db["blog_comments"].insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    doc["created_at"] = doc["created_at"].isoformat()
    return doc


async def delete_blog(blog_id: str):
    db = get_db()
    collection = db["blogs"]
    try:
        result = await collection.delete_one({"_id": ObjectId(blog_id)})
        return result.deleted_count > 0
    except Exception:
        return False


async def toggle_blog_status(blog_id: str):
    db = get_db()
    collection = db["blogs"]
    try:
        doc = await collection.find_one({"_id": ObjectId(blog_id)})
        if not doc:
            return None
        new_status = "published" if doc.get("status") != "published" else "draft"
        await collection.update_one(
            {"_id": ObjectId(blog_id)},
            {"$set": {"status": new_status, "updated_at": datetime.utcnow()}}
        )
        doc["status"] = new_status
        return _serialize(doc)
    except Exception:
        return None