from datetime import datetime, timezone
from fastapi import HTTPException
from uuid import uuid4

from core.database import get_db
from modules.owners.schemas import OwnerCreate, OwnerUpdate


# =========================
# NORMALIZER (CRITICAL)
# =========================
def normalize_owner(owner: dict) -> dict:
    """
    Guarantees Owner schema compatibility.
    Fixes legacy / broken Mongo records safely.
    """

    # 🔥 FIX 1: id MUST be string
    if not owner.get("id"):
        owner["id"] = str(uuid4())

    # 🔥 FIX 2: timestamps MUST be datetime
    for field in ("created_at", "updated_at"):
        value = owner.get(field)

        if value is None:
            owner[field] = datetime.now(timezone.utc)
        elif isinstance(value, str):
            try:
                owner[field] = datetime.fromisoformat(value)
            except ValueError:
                owner[field] = datetime.now(timezone.utc)

    # 🔥 FIX 3: status default
    owner.setdefault("status", "active")

    return owner


# =========================
# CREATE OWNER
# =========================
async def create_owner(data: OwnerCreate):
    db = get_db()
    now = datetime.now(timezone.utc)

    owner = data.model_dump()
    owner.update({
        "id": str(uuid4()),
        "status": "active",
        "created_at": now,
        "updated_at": now,
    })

    await db.owners.insert_one(owner)
    return owner


# =========================
# LIST OWNERS (FIXED)
# =========================
async def get_owners(filters: dict, limit: int = 100):
    db = get_db()
    owners = await db.owners.find(filters, {"_id": 0}).to_list(limit)
    return [normalize_owner(o) for o in owners]


# =========================
# GET OWNER BY ID
# =========================
async def get_owner_by_id(owner_id: str):
    db = get_db()
    owner = await db.owners.find_one({"id": owner_id}, {"_id": 0})

    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found")

    return normalize_owner(owner)


# =========================
# UPDATE OWNER
# =========================
async def update_owner(owner_id: str, data: OwnerUpdate):
    db = get_db()

    existing = await db.owners.find_one({"id": owner_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Owner not found")

    update_data = data.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.now(timezone.utc)

    await db.owners.update_one(
        {"id": owner_id},
        {"$set": update_data}
    )

    return await get_owner_by_id(owner_id)


# =========================
# DELETE OWNER
# =========================
async def delete_owner(owner_id: str):
    db = get_db()
    result = await db.owners.delete_one({"id": owner_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Owner not found")
