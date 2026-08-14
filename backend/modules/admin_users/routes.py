from fastapi import APIRouter, Depends, HTTPException, Query
from core.database import get_db
from core.security import require_role
from typing import Optional

router = APIRouter(prefix="/admin/users", tags=["Admin Users"])


@router.get("/stats")
async def user_stats(
    _=Depends(require_role(["ADMIN"])),
    db=Depends(get_db),
):
    total = await db.users.count_documents({})
    verified = await db.users.count_documents({"email_verified": True})
    referred = await db.users.count_documents({"referred_by": {"$ne": None, "$exists": True}})
    roles_pipeline = [{"$group": {"_id": "$role", "count": {"$sum": 1}}}]
    role_data = await db.users.aggregate(roles_pipeline).to_list(20)
    by_role = {r["_id"]: r["count"] for r in role_data if r["_id"]}

    return {
        "total": total,
        "verified": verified,
        "referred": referred,
        "by_role": by_role,
    }


@router.get("")
@router.get("/")
async def list_users(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    _=Depends(require_role(["ADMIN"])),
    db=Depends(get_db),
):
    query = {}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"phone": {"$regex": search, "$options": "i"}},
        ]
    if role:
        query["role"] = role

    skip = (page - 1) * limit
    total = await db.users.count_documents(query)

    cursor = db.users.find(query, {"_id": 0, "password": 0}).sort("created_at", -1).skip(skip).limit(limit)
    users = await cursor.to_list(length=limit)

    return {
        "users": users,
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit,
    }


@router.delete("/{user_id}")
async def delete_user(
    user_id: str,
    _=Depends(require_role(["ADMIN"])),
    db=Depends(get_db),
):
    if user_id == "admin-1":
        raise HTTPException(status_code=403, detail="Cannot delete the primary admin account")

    result = await db.users.delete_one({"id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User deleted"}


@router.patch("/{user_id}")
async def update_user(
    user_id: str,
    payload: dict,
    _=Depends(require_role(["ADMIN"])),
    db=Depends(get_db),
):
    if user_id == "admin-1" and payload.get("role") and payload["role"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Cannot change primary admin role")

    allowed = {"role", "wallet_balance", "name", "phone"}
    updates = {k: v for k, v in payload.items() if k in allowed}
    if not updates:
        raise HTTPException(status_code=400, detail="No valid fields to update")

    result = await db.users.update_one({"id": user_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User updated"}
