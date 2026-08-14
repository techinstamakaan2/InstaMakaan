from fastapi import APIRouter, Depends, HTTPException
from core.database import get_db
from core.security import require_role
from datetime import datetime, timezone
from typing import Optional
import uuid

router = APIRouter(prefix="/users/me/visits", tags=["Visits"])


@router.get("")
@router.get("/")
async def get_my_visits(
    current_user=Depends(require_role(["USER", "ADMIN", "AGENT", "OWNER"])),
    db=Depends(get_db),
):
    visits = await db.visits.find(
        {"user_id": current_user["id"]}, {"_id": 0}
    ).sort("visit_date", -1).to_list(50)
    return {"visits": visits}


@router.post("")
@router.post("/")
async def schedule_visit(
    payload: dict,
    current_user=Depends(require_role(["USER", "ADMIN", "AGENT", "OWNER"])),
    db=Depends(get_db),
):
    property_id = payload.get("property_id")
    visit_date = payload.get("visit_date")
    visit_time = payload.get("visit_time")
    message = payload.get("message", "")

    if not property_id or not visit_date or not visit_time:
        raise HTTPException(status_code=400, detail="property_id, visit_date and visit_time are required")

    prop = await db.properties.find_one({"id": property_id}, {"_id": 0, "title": 1, "location": 1, "images": 1})
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")

    visit = {
        "id": str(uuid.uuid4()),
        "user_id": current_user["id"],
        "user_name": current_user.get("name", ""),
        "user_email": current_user.get("email", ""),
        "property_id": property_id,
        "property_title": prop.get("title", "Property"),
        "property_location": prop.get("location", ""),
        "property_image": (prop.get("images") or [None])[0],
        "visit_date": visit_date,
        "visit_time": visit_time,
        "message": message,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.visits.insert_one(visit)
    return {"message": "Visit scheduled", "visit": visit}


@router.patch("/{visit_id}/cancel")
async def cancel_visit(
    visit_id: str,
    current_user=Depends(require_role(["USER", "ADMIN", "AGENT", "OWNER"])),
    db=Depends(get_db),
):
    visit = await db.visits.find_one({"id": visit_id, "user_id": current_user["id"]})
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")
    if visit["status"] == "completed":
        raise HTTPException(status_code=400, detail="Cannot cancel a completed visit")
    await db.visits.update_one({"id": visit_id}, {"$set": {"status": "cancelled"}})
    return {"message": "Visit cancelled"}


# Admin endpoints
@router.get("/admin/all")
async def admin_all_visits(
    page: int = 1,
    limit: int = 30,
    status: Optional[str] = None,
    _=Depends(require_role(["ADMIN"])),
    db=Depends(get_db),
):
    query = {}
    if status:
        query["status"] = status
    skip = (page - 1) * limit
    total = await db.visits.count_documents(query)
    visits = await db.visits.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    return {"visits": visits, "total": total, "page": page, "pages": (total + limit - 1) // limit}


@router.patch("/admin/{visit_id}")
async def admin_update_visit(
    visit_id: str,
    payload: dict,
    _=Depends(require_role(["ADMIN"])),
    db=Depends(get_db),
):
    allowed = {"status", "admin_note"}
    updates = {k: v for k, v in payload.items() if k in allowed}
    if not updates:
        raise HTTPException(status_code=400, detail="No valid fields")
    await db.visits.update_one({"id": visit_id}, {"$set": updates})
    return {"message": "Visit updated"}
