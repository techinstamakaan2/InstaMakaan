from fastapi import APIRouter, Depends
from typing import Optional

from modules.instagram.schemas import InstagramPost, InstagramPostCreate, InstagramPostUpdate
from modules.instagram.service import (
    create_instagram_post,
    get_instagram_posts,
    get_instagram_post_by_id,
    update_instagram_post,
    delete_instagram_post,
)

# -------------------------------------------------
# SAFE RBAC IMPORT (same pattern as properties)
# -------------------------------------------------
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

# -------------------------------------------------
# ROUTER
# -------------------------------------------------
router = APIRouter(
    prefix="/instagram",
    tags=["Instagram"]
)

# -------------------------------------------------
# PUBLIC — Frontend fetches active posts
# -------------------------------------------------
@router.get("/")
async def list_active_posts(page: int = 1, limit: int = 20):
    """Returns only active posts — used by the public frontend."""
    return await get_instagram_posts(admin=False, page=page, limit=limit)

# -------------------------------------------------
# ADMIN — Full CRUD
# -------------------------------------------------
@router.get("/admin/all")
async def list_all_posts(
    page: int = 1,
    limit: int = 20,
    user=Depends(require_role(["ADMIN", "admin"]))
):
    """Returns all posts including hidden — used by admin panel."""
    return await get_instagram_posts(admin=True, page=page, limit=limit)


@router.post("/", response_model=InstagramPost)
async def create(
    data: InstagramPostCreate,
    user=Depends(require_role(["ADMIN", "admin"]))
):
    return await create_instagram_post(data, user)


@router.get("/{post_id}", response_model=InstagramPost)
async def get_one(post_id: str):
    return await get_instagram_post_by_id(post_id)


@router.put("/{post_id}", response_model=InstagramPost)
async def update(
    post_id: str,
    data: InstagramPostUpdate,
    user=Depends(require_role(["ADMIN", "admin"]))
):
    return await update_instagram_post(post_id, data)


@router.delete("/{post_id}")
async def delete(
    post_id: str,
    user=Depends(require_role(["ADMIN", "admin"]))
):
    from core.database import log_audit
    from core.database import get_db
    db = get_db()

    await delete_instagram_post(post_id)

    await log_audit(
        db,
        user_id=user["id"],
        role=user["role"],
        action="delete_instagram_post",
        resource="instagram_post",
        resource_id=post_id,
    )

    return {"message": "Instagram post deleted successfully"}


# -------------------------------------------------
# HEALTH CHECK
# -------------------------------------------------
@router.get("/ping")
async def ping():
    return {"message": "Instagram module working"}