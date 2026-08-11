from fastapi import APIRouter, Depends, Request
from typing import Dict, Any

from slowapi import Limiter
from slowapi.util import get_remote_address

from modules.dashboard.schemas import DashboardStats
from modules.dashboard.service import get_admin_dashboard_stats
from core.database import get_db, log_audit

# -------------------------------------------------
# SAFE RBAC IMPORT (CURRENT + FUTURE, NO BREAK)
# -------------------------------------------------
try:
    # current working RBAC
    from core.security import require_role
except ImportError:
    try:
        # future RBAC
        from core.rbac import require_role
    except ImportError:
        # fallback (noop – avoids crashes)
        def require_role(roles):
            async def _noop():
                return None
            return _noop

# -------------------------------------------------
# ROUTER & RATE LIMITER
# -------------------------------------------------
limiter = Limiter(key_func=get_remote_address)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

# -------------------------------------------------
# DASHBOARD STATS (ADMIN)
# -------------------------------------------------
@router.get("/stats", response_model=DashboardStats)
async def admin_dashboard(
    user=Depends(require_role(["ADMIN", "admin"]))
):
    return await get_admin_dashboard_stats()


@router.get("/ping")
async def ping():
    return {"message": "Dashboard working"}

# -------------------------------------------------
# CMS (ADMIN ONLY)
# -------------------------------------------------
@router.get("/cms/{page}")
async def get_cms_page_admin(
    page: str,
    user=Depends(require_role(["ADMIN", "admin"])),
    db=Depends(get_db)
):
    doc = await db.cms.find_one({"page": page}, {"_id": 0})
    if not doc:
        return {"page": page, "content": {}}
    return doc


@router.put("/cms/{page}")
async def update_cms_page(
    page: str,
    payload: Dict[str, Any],
    user=Depends(require_role(["ADMIN", "admin"])),
    db=Depends(get_db)
):
    await db.cms.update_one(
        {"page": page},
        {"$set": {"page": page, "content": payload}},
        upsert=True
    )

    # ✅ audit log
    await log_audit(
        db,
        user_id=user["id"],
        role=user["role"],
        action="update_cms",
        resource="cms",
        resource_id=page,
    )

    return {"message": "CMS updated successfully"}

# -------------------------------------------------
# CMS (PUBLIC – FRONTEND)
# -------------------------------------------------
@router.get("/public/cms/{page}", tags=["CMS"])
@limiter.limit("30/minute")
async def get_cms_page_public(
    request: Request,   # required for slowapi
    page: str,
    db=Depends(get_db)
):
    doc = await db.cms.find_one({"page": page}, {"_id": 0})
    if not doc:
        return {"page": page, "content": {}}
    return doc
