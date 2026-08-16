from fastapi import APIRouter, Depends
from typing import Optional, List

from modules.owners.schemas import Owner, OwnerCreate, OwnerUpdate
from modules.owners.service import (
    create_owner,
    get_owners,
    get_owner_by_id,
    update_owner,
    delete_owner,
)

from core.security import require_role
from core.database import get_db
router = APIRouter(
    prefix="/owners",
    tags=["Owners"]
)

@router.post("")
@router.post("/", response_model=Owner)
async def create(
    data: OwnerCreate,
    user=Depends(require_role(["ADMIN"]))
):
    return await create_owner(data)

@router.get("")
@router.get("/", response_model=List[Owner])
async def list_all(
    status: Optional[str] = None,
    limit: int = 100,
    user=Depends(require_role(["ADMIN"]))
):
    filters = {}
    if status:
        filters["status"] = status
    return await get_owners(filters, limit)

@router.get("/{owner_id}", response_model=Owner)
async def get_one(
    owner_id: str,
    user=Depends(require_role(["ADMIN", "OWNER"]))
):
    return await get_owner_by_id(owner_id)

@router.put("/{owner_id}", response_model=Owner)
async def update(
    owner_id: str,
    data: OwnerUpdate,
    user=Depends(require_role(["ADMIN"]))
):
    return await update_owner(owner_id, data)

@router.delete("/{owner_id}")
async def delete(
    owner_id: str,
    user=Depends(require_role(["ADMIN"]))
):
    await delete_owner(owner_id)
    return {"message": "Owner deleted successfully"}
@router.get("/{owner_id}/dashboard")
async def get_owner_dashboard(
    owner_id: str,
    user=Depends(require_role(["ADMIN", "OWNER"]))
):
    owner = await get_owner_by_id(owner_id)
    db = get_db()
    properties = await db.properties.find({"owner_id": owner_id}).to_list(100)
    
    return {
        "owner": owner,
        "total_properties": len(properties),
        "active_properties": len([p for p in properties if p.get("status") == "active"]),
        "total_earnings": sum(e.get("amount", 0) for e in owner.get("earnings_history", []) if e.get("status") == "paid"),
        "current_month_earnings": 0,
        "properties": properties,
        "earnings_history": owner.get("earnings_history", [])
    }

@router.get("/ping")
async def ping():
    return {"message": "Owners working"}