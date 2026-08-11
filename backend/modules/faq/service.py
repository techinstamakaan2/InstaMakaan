import re
import uuid
from bson import ObjectId
from datetime import datetime
from core.database import get_db


def _serialize(doc) -> dict:
    if doc is None:
        return None
    doc["_id"] = str(doc["_id"])
    return doc


def _slugify(text: str) -> str:
    return re.sub(r'\s+', '-', re.sub(r'[^a-z0-9\s-]', '', text.lower().strip()))


# ── Category CRUD ─────────────────────────────────────────────────────────────

async def get_all_categories(status: str = None, include_faqs: bool = True):
    db = get_db()
    col = db["faq_categories"]
    query = {}
    if status and status != "all":
        query["status"] = status

    projection = None if include_faqs else {"faqs": 0}
    cursor = col.find(query, projection).sort("order", 1)
    return [_serialize(doc) async for doc in cursor]


async def get_category_by_id(category_id: str):
    db = get_db()
    col = db["faq_categories"]
    try:
        doc = await col.find_one({"_id": ObjectId(category_id)})
    except Exception:
        return None
    return _serialize(doc)


async def get_category_by_slug(slug: str):
    db = get_db()
    col = db["faq_categories"]
    doc = await col.find_one({"slug": slug})
    return _serialize(doc)


async def create_category(data: dict):
    db = get_db()
    col = db["faq_categories"]

    # Auto-generate slug from name if not provided
    if not data.get("slug") and data.get("name"):
        data["slug"] = _slugify(data["name"])

    data.setdefault("order", 0)
    data.setdefault("status", "published")
    data.setdefault("faqs", [])
    data["created_at"] = datetime.utcnow()
    data["updated_at"] = datetime.utcnow()

    result = await col.insert_one(data)
    created = await col.find_one({"_id": result.inserted_id})
    return _serialize(created)


async def update_category(category_id: str, data: dict):
    db = get_db()
    col = db["faq_categories"]
    data["updated_at"] = datetime.utcnow()
    clean = {k: v for k, v in data.items() if v is not None}
    try:
        await col.update_one({"_id": ObjectId(category_id)}, {"$set": clean})
        updated = await col.find_one({"_id": ObjectId(category_id)})
        return _serialize(updated)
    except Exception:
        return None


async def delete_category(category_id: str):
    db = get_db()
    col = db["faq_categories"]
    try:
        result = await col.delete_one({"_id": ObjectId(category_id)})
        return result.deleted_count > 0
    except Exception:
        return False


async def toggle_category_status(category_id: str):
    db = get_db()
    col = db["faq_categories"]
    try:
        doc = await col.find_one({"_id": ObjectId(category_id)})
        if not doc:
            return None
        new_status = "published" if doc.get("status") != "published" else "draft"
        await col.update_one(
            {"_id": ObjectId(category_id)},
            {"$set": {"status": new_status, "updated_at": datetime.utcnow()}}
        )
        doc["status"] = new_status
        return _serialize(doc)
    except Exception:
        return None


# ── FAQ item operations (within a category) ───────────────────────────────────

async def add_faq_to_category(category_id: str, faq: dict):
    """Append a single FAQ item to an existing category."""
    db = get_db()
    col = db["faq_categories"]
    faq["id"] = str(uuid.uuid4())          # give each FAQ a stable id
    try:
        await col.update_one(
            {"_id": ObjectId(category_id)},
            {
                "$push": {"faqs": faq},
                "$set":  {"updated_at": datetime.utcnow()},
            },
        )
        updated = await col.find_one({"_id": ObjectId(category_id)})
        return _serialize(updated)
    except Exception:
        return None


async def reorder_categories(ordered_ids: list[str]):
    """Accept a list of category IDs in desired order and update their 'order' field."""
    db = get_db()
    col = db["faq_categories"]
    for idx, cid in enumerate(ordered_ids):
        try:
            await col.update_one({"_id": ObjectId(cid)}, {"$set": {"order": idx}})
        except Exception:
            pass
    return True