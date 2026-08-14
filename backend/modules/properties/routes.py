from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from typing import Optional, List
from datetime import datetime, timezone
from uuid import uuid4
import os

from modules.properties.schemas import Property, PropertyCreate, PropertyUpdate, PropertyList
from modules.properties.service import (
    create_property,
    get_properties,
    get_property_by_id,
    get_property_by_short_id,
    update_property,
    delete_property,
    get_locations,
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
    prefix="/properties",
    tags=["Properties"]
)

# ✅ Bug 6 Fix: /ping SABSE PEHLE — warna /{property_id} match kar leta hai
@router.get("/ping")
async def ping():
    return {"message": "Properties working"}

# ✅ Bug 7 Fix: /locations aur /by-short-id specific routes PEHLE
@router.get("/locations")
async def list_locations():
    return await get_locations()

@router.get("/by-short-id/{short_id}")
async def get_by_short_id(short_id: str):
    return await get_property_by_short_id(short_id)

@router.post("/", response_model=Property)
async def create(
    data: PropertyCreate,
    user=Depends(require_role(["ADMIN", "admin"]))
):
    return await create_property(data, user)

@router.get("")
@router.get("/")
async def list_all(
    property_type: Optional[str] = None,
    status: Optional[str] = None,
    owner_id: Optional[str] = None,
    city: Optional[str] = None,
    beds: Optional[int] = None,
    search: Optional[str] = None,
    page: int = 1,
    limit: int = 10
):
    filters = {}
    if property_type:
        filters["property_type"] = property_type
    if status:
        filters["status"] = status
    if owner_id:
        filters["owner_id"] = owner_id
    if city:
        filters["city"] = city
    if beds:
        filters["beds"] = beds
    if search:
        filters["$or"] = [
            {"locality": {"$regex": search, "$options": "i"}},
            {"location": {"$regex": search, "$options": "i"}},
            {"sector":   {"$regex": search, "$options": "i"}},
            {"city":     {"$regex": search, "$options": "i"}},
            {"title":    {"$regex": search, "$options": "i"}},
        ]
    return await get_properties(filters, page, limit)

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm"}
MAX_FILE_SIZE_MB = 20
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ✅ Bug 10 Fix: db = get_db() direct call — Depends(get_db) hataya
@router.post("/media")
async def upload_media(
    file: UploadFile = File(...),
    user=Depends(require_role(["ADMIN", "admin"])),
):
    if file.content_type not in (ALLOWED_IMAGE_TYPES | ALLOWED_VIDEO_TYPES):
        raise HTTPException(status_code=400, detail="Unsupported file type")
    contents = await file.read()
    if len(contents) / (1024 * 1024) > MAX_FILE_SIZE_MB:
        raise HTTPException(status_code=400, detail="File too large")

    db = get_db()  # ✅ consistent with baaki routes

    media_id = str(uuid4())
    filename = f"{media_id}.{file.filename.split('.')[-1]}"
    path = f"{UPLOAD_DIR}/{filename}"
    with open(path, "wb") as f:
        f.write(contents)
    media_doc = {
        "id": media_id, "filename": filename, "path": path,
        "content_type": file.content_type, "uploaded_by": user["id"],
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.media.insert_one(media_doc)
    return {"media_id": media_id, "url": f"/uploads/{filename}", "type": file.content_type}

# ✅ Bug 1 Fix: Multiple files upload ke liye /upload/multiple endpoint
@router.post("/upload/multiple")
async def upload_multiple_images(
    files: List[UploadFile] = File(...),
    user=Depends(require_role(["ADMIN", "admin"])),
):
    db = get_db()  # ✅ consistent
    uploaded = []
    for file in files:
        if file.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}")
        contents = await file.read()
        if len(contents) / (1024 * 1024) > MAX_FILE_SIZE_MB:
            raise HTTPException(status_code=400, detail="File too large")
        media_id = str(uuid4())
        filename = f"{media_id}.{file.filename.split('.')[-1]}"
        path = f"{UPLOAD_DIR}/{filename}"
        with open(path, "wb") as f:
            f.write(contents)
        uploaded.append({"url": f"/{path}", "type": file.content_type})
    return uploaded

@router.post("/{property_id}/images")
async def add_images(
    property_id: str,
    images: List[str],
    user=Depends(require_role(["ADMIN", "admin"]))
):
    prop = await get_property_by_id(property_id)
    updated = prop.get("images", []) + images
    db = get_db()
    await db.properties.update_one(
        {"id": property_id},
        {"$set": {"images": updated, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"message": "Images added", "images": updated}

# ✅ Bug 8 Fix: rooms route /{property_id} se PEHLE define karo
@router.get("/{parent_id}/rooms", response_model=List[Property])
async def get_rooms(parent_id: str):
    db = get_db()  # ✅ sync direct call
    rooms = await db.properties.find(
        {"parent_property_id": parent_id, "is_parent": False},
        {"_id": 0}
    ).to_list(100)
    return rooms

# ✅ Generic route SABSE LAST — specific routes ke baad
@router.get("/{property_id}", response_model=Property)
async def get_one(property_id: str):
    return await get_property_by_id(property_id)

@router.put("/{property_id}", response_model=Property)
async def update(
    property_id: str,
    data: PropertyUpdate,
    user=Depends(require_role(["ADMIN", "admin"]))
):
    return await update_property(property_id, data)

@router.delete("/{property_id}")
async def delete(
    property_id: str,
    user=Depends(require_role(["ADMIN", "admin"]))
):
    db = get_db()
    await delete_property(property_id)
    from core.database import log_audit
    await log_audit(
        db,
        user_id=user["id"],
        role=user["role"],
        action="delete_property",
        resource="property",
        resource_id=property_id,
    )
    return {"message": "Property deleted successfully"}