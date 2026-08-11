from datetime import datetime, timezone
from fastapi import HTTPException
from core.database import get_db
from modules.properties.schemas import PropertyCreate, PropertyUpdate
from uuid import uuid4
import re  # ✅ Bug 11 Fix: ReDoS ke liye


async def create_property(data: PropertyCreate, user: dict):
    db = get_db()
    now = datetime.now(timezone.utc).isoformat()
    prop = data.model_dump()
    prop.update({
        "id": prop.get("id") or str(uuid4()),
        "images": prop.get("images", []),
        "created_at": now,
        "updated_at": now,
    })
    await db.properties.insert_one(prop)
    return prop


async def get_properties(filters: dict, page: int = 1, limit: int = 10):
    db = get_db()
    skip = (page - 1) * limit
    total = await db.properties.count_documents(filters)
    cursor = db.properties.find(
        filters,
        {
            "_id": 0, "id": 1, "title": 1, "property_type": 1,
            "price": 1, "price_label": 1, "city": 1, "sector": 1, "location": 1,
            "beds": 1, "baths": 1, "furnishing": 1, "status": 1, "images": 1,
            "monthly_rent_amount": 1, "is_managed": 1,
            # ✅ Map fix: map_embed returned so AllPropertiesPage can extract lat/lng
            "map_embed": 1,
        }
    ).sort("created_at", -1).skip(skip).limit(limit)
    properties = await cursor.to_list(length=limit)
    for p in properties:
        images = p.get("images", [])
        p["thumbnail"] = images[0]["url"] if images and isinstance(images[0], dict) else (
            images[0] if images and isinstance(images[0], str) else None
        )
        p.pop("images", None)
    return {"success": True, "page": page, "limit": limit, "total": total, "data": properties}


BUDGET_BUCKETS = [10000, 15000, 20000, 25000, 30000]


async def get_locations():
    db = get_db()
    cities     = [c for c in await db.properties.distinct("city")     if c]
    localities = [l for l in await db.properties.distinct("locality") if l]
    sectors    = [s for s in await db.properties.distinct("sector")   if s]
    beds_list  = sorted([b for b in await db.properties.distinct("beds") if b])
    # Fallback: if no locality field set yet, use sectors as area list
    areas = localities if localities else sectors

    # Real combos — which locality+BHK and locality+budget-bucket combinations
    # actually have at least one active listing behind them. The frontend uses
    # this to only link to pages that have real results, instead of blindly
    # cross-producting every locality x every BHK/price. Stays in sync
    # automatically as properties are added/removed.
    locality_beds = {}
    locality_min_rent = {}
    cursor = db.properties.find(
        {"status": "active", "locality": {"$ne": None}},
        {"locality": 1, "beds": 1, "monthly_rent_amount": 1, "_id": 0},
    )
    async for doc in cursor:
        loc = doc.get("locality")
        if not loc:
            continue
        if doc.get("beds"):
            locality_beds.setdefault(loc, set()).add(doc["beds"])
        rent = doc.get("monthly_rent_amount")
        if rent:
            if loc not in locality_min_rent or rent < locality_min_rent[loc]:
                locality_min_rent[loc] = rent

    locality_bhk_combos = {loc: sorted(beds) for loc, beds in locality_beds.items()}
    locality_budget_combos = {
        loc: [p for p in BUDGET_BUCKETS if p >= min_rent]
        for loc, min_rent in locality_min_rent.items()
    }

    return {
        "success": True,
        "cities": cities,
        "localities": localities,
        "sectors": sectors,
        "areas": areas,
        "beds": beds_list,
        "locality_bhk_combos": locality_bhk_combos,
        "locality_budget_combos": locality_budget_combos,
    }


async def get_property_by_id(property_id: str):
    db = get_db()
    prop = await db.properties.find_one({"id": property_id}, {"_id": 0})
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    return prop


async def get_property_by_short_id(short_id: str):
    db = get_db()
    # ✅ Bug 11 Fix: re.escape() use kiya — ReDoS vulnerability hatai
    safe_short_id = re.escape(short_id)
    prop = await db.properties.find_one(
        {"id": {"$regex": f"^{safe_short_id}", "$options": "i"}},
        {"_id": 0}
    )
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    return prop


async def update_property(property_id: str, data: PropertyUpdate):
    db = get_db()
    existing = await db.properties.find_one({"id": property_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Property not found")
    update_data = data.model_dump(exclude_unset=True)
    update_data.pop("id", None)
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.properties.update_one({"id": property_id}, {"$set": update_data})
    return await get_property_by_id(property_id)


async def delete_property(property_id: str):
    if not property_id:
        raise HTTPException(status_code=400, detail="Invalid property id")
    db = get_db()
    existing = await db.properties.find_one({"id": property_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Property not found")
    await db.properties.delete_one({"id": property_id})
    return existing