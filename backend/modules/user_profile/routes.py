from fastapi import APIRouter, Depends, HTTPException
from core.database import get_db
from core.security import require_role

router = APIRouter(prefix="/users/me/profile", tags=["User Profile"])

ALLOWED_UPDATE_FIELDS = {
    "name", "dob", "gender", "pan_number",
    "aadhaar_last4", "emergency_name", "emergency_phone", "address"
}


@router.get("")
@router.get("/")
async def get_profile(
    current_user=Depends(require_role(["USER", "ADMIN", "AGENT", "OWNER"])),
    db=Depends(get_db),
):
    user = await db.users.find_one({"id": current_user["id"]}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("")
@router.patch("/")
async def update_profile(
    payload: dict,
    current_user=Depends(require_role(["USER", "ADMIN", "AGENT", "OWNER"])),
    db=Depends(get_db),
):
    updates = {k: v for k, v in payload.items() if k in ALLOWED_UPDATE_FIELDS and v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No valid fields to update")

    # Mask PAN: store only, never expose full number in logs
    if "pan_number" in updates:
        pan = str(updates["pan_number"]).upper().strip()
        if len(pan) != 10:
            raise HTTPException(status_code=400, detail="PAN number must be 10 characters")
        updates["pan_number"] = pan

    # Aadhaar: store only last 4 digits
    if "aadhaar_last4" in updates:
        a = str(updates["aadhaar_last4"]).strip().replace(" ", "")
        updates["aadhaar_last4"] = a[-4:] if len(a) >= 4 else a

    await db.users.update_one({"id": current_user["id"]}, {"$set": updates})
    updated = await db.users.find_one({"id": current_user["id"]}, {"_id": 0, "password": 0})
    return updated
