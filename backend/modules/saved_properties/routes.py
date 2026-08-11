from fastapi import APIRouter, Depends, HTTPException
from core.database import get_db
from core.security import get_current_user

router = APIRouter(prefix="/users/me", tags=["Saved Properties"])


@router.post("/saved/{property_id}")
async def toggle_saved_property(
    property_id: str,
    current_user=Depends(get_current_user),
    db=Depends(get_db),
):
    user = await db.users.find_one({"id": current_user["id"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    saved = user.get("saved_properties", [])
    if property_id in saved:
        saved.remove(property_id)
        action = "removed"
    else:
        saved.append(property_id)
        action = "saved"

    await db.users.update_one(
        {"id": current_user["id"]},
        {"$set": {"saved_properties": saved}},
    )
    return {"action": action, "saved_properties": saved}


@router.get("/saved")
async def get_saved_properties(
    current_user=Depends(get_current_user),
    db=Depends(get_db),
):
    user = await db.users.find_one({"id": current_user["id"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    saved_ids = user.get("saved_properties", [])
    if not saved_ids:
        return {"saved_properties": []}

    # Fetch full property details for each saved ID
    properties = []
    for prop_id in saved_ids:
        prop = await db.properties.find_one(
            {"$or": [{"id": prop_id}, {"_id": prop_id}]},
            {"_id": 0},
        )
        if prop:
            properties.append(prop)

    return {"saved_properties": properties}
