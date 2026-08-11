from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, List
from datetime import datetime, timezone

from modules.inquiries.schemas import Inquiry, InquiryCreate, InquiryUpdate
from modules.inquiries.service import (
    create_inquiry,
    list_inquiries,
    get_inquiry_by_id,
    update_inquiry,
    assign_agent,
)
from core.database import get_db
try:
    from core.security import require_role
except ImportError:
    try:
        from core.rbac import require_role
    except ImportError:
        def require_role(roles):
            async def _noop():
                return None
            return _noop

router = APIRouter(
    prefix="/inquiries",
    tags=["Inquiries"]
)

# ✅ /ping ABOVE /{inquiry_id}
@router.get("/ping")
async def ping():
    return {"message": "Inquiries working"}

@router.post("/", response_model=Inquiry)  # ← ONLY CHANGE: added response_model=Inquiry
async def create(data: InquiryCreate):
    return await create_inquiry(data)

@router.get("/", response_model=List[Inquiry])
async def list_all(
    stage: Optional[str] = None,
    inquiry_type: Optional[str] = None,
    assigned_agent_id: Optional[str] = None,
    limit: int = 500,
    user=Depends(require_role(["admin"]))
):
    filters = {}
    if stage:
        filters["stage"] = stage
    if inquiry_type:
        filters["inquiry_type"] = inquiry_type
    if assigned_agent_id:
        filters["assigned_agent_id"] = assigned_agent_id
    return await list_inquiries(filters, limit)

@router.get("/{inquiry_id}", response_model=Inquiry)
async def get_one(
    inquiry_id: str,
    user=Depends(require_role(["admin", "agent"]))
):
    return await get_inquiry_by_id(inquiry_id)

@router.put("/{inquiry_id}", response_model=Inquiry)
async def update(
    inquiry_id: str,
    data: InquiryUpdate,
    user=Depends(require_role(["admin", "agent"]))
):
    return await update_inquiry(inquiry_id, data)

# ✅ get_db via Depends
@router.put("/{inquiry_id}/assign")
async def assign(
    inquiry_id: str,
    agent_id: str,
    user=Depends(require_role(["admin"])),
    db=Depends(get_db)
):
    agent = await db.agents.find_one({"id": agent_id}, {"_id": 0})
    if not agent:
        return {"error": "Agent not found"}
    await assign_agent(inquiry_id, agent_id, agent["name"])
    return {"message": "Inquiry assigned successfully"}

# ✅ notes stored as object with timestamp
@router.post("/{inquiry_id}/notes")
async def add_note(
    inquiry_id: str,
    note: str,
    user=Depends(require_role(["admin", "agent"])),
    db=Depends(get_db)
):
    note_entry = {
        "text": note,
        "author": "Agent",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    await db.inquiries.update_one(
        {"id": inquiry_id},
        {
            "$push": {"notes": note_entry},
            "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
        }
    )
    return {"message": "Note added"}

# ✅ DELETE route for bulk delete
@router.delete("/{inquiry_id}")
async def delete_inquiry(
    inquiry_id: str,
    user=Depends(require_role(["admin"])),
    db=Depends(get_db)
):
    result = await db.inquiries.delete_one({"id": inquiry_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"message": "Deleted successfully"}