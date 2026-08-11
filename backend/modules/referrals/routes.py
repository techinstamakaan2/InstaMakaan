from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from core.database import get_db
from core.security import get_current_user, require_role

router = APIRouter(prefix="/referrals", tags=["Referrals"])


@router.get("/lookup")
async def lookup_referral_code(code: str = Query(..., min_length=1), db=Depends(get_db)):
    """Public endpoint — returns referrer's first name for a given code."""
    user = await db.users.find_one(
        {"referral_code": code.strip().upper()},
        {"_id": 0, "name": 1},
    )
    if not user or not user.get("name"):
        raise HTTPException(status_code=404, detail="Invalid referral code")
    # Return only the first name for privacy
    first_name = user["name"].split()[0].capitalize()
    return {"name": first_name}


@router.get("/my-stats")
async def get_my_stats(current_user=Depends(get_current_user), db=Depends(get_db)):
    user = await db.users.find_one({"id": current_user["id"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    referral_code = user.get("referral_code", "")
    referral_count = await db.users.count_documents({"referred_by": referral_code}) if referral_code else 0
    verified_count = await db.users.count_documents(
        {"referred_by": referral_code, "email_verified": True}
    ) if referral_code else 0

    return {
        "referral_code": referral_code,
        "referral_count": referral_count,
        "verified_count": verified_count,
        "pending_count": referral_count - verified_count,
        "wallet_balance": user.get("wallet_balance", 0),
        "name": user.get("name", ""),
        "email": user.get("email", ""),
    }


@router.get("/history")
async def get_referral_history(current_user=Depends(get_current_user), db=Depends(get_db)):
    user = await db.users.find_one({"id": current_user["id"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    referral_code = user.get("referral_code", "")
    if not referral_code:
        return {"referrals": []}

    cursor = db.users.find(
        {"referred_by": referral_code},
        {"_id": 0, "name": 1, "email": 1, "email_verified": 1, "created_at": 1},
    ).sort("created_at", -1).limit(100)

    referrals = await cursor.to_list(length=100)
    return {"referrals": referrals}


@router.get("/admin/all")
async def admin_all_referrals(
    page: int = Query(1, ge=1),
    limit: int = Query(30, ge=1, le=100),
    search: Optional[str] = Query(None),
    _=Depends(require_role(["ADMIN"])),
    db=Depends(get_db),
):
    query = {"referred_by": {"$ne": None, "$exists": True}}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
        ]

    skip = (page - 1) * limit
    total = await db.users.count_documents(query)
    cursor = db.users.find(
        query,
        {"_id": 0, "name": 1, "email": 1, "referred_by": 1, "email_verified": 1, "created_at": 1},
    ).sort("created_at", -1).skip(skip).limit(limit)
    referrals = await cursor.to_list(length=limit)

    # Enrich: attach referrer info
    for ref in referrals:
        referrer = await db.users.find_one(
            {"referral_code": ref["referred_by"]},
            {"_id": 0, "name": 1, "email": 1},
        )
        ref["referrer"] = referrer or {}

    # Summary stats
    total_referrals = await db.users.count_documents({"referred_by": {"$ne": None, "$exists": True}})
    verified_referrals = await db.users.count_documents(
        {"referred_by": {"$ne": None, "$exists": True}, "email_verified": True}
    )

    return {
        "referrals": referrals,
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit,
        "stats": {
            "total_referrals": total_referrals,
            "verified": verified_referrals,
            "pending": total_referrals - verified_referrals,
        },
    }
