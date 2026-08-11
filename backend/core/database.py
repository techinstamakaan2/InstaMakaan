from motor.motor_asyncio import AsyncIOMotorClient
from core.config import MONGO_URL, DB_NAME
from datetime import datetime, timezone
from typing import Optional, Dict, Any

_client: AsyncIOMotorClient | None = None


def get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        if not MONGO_URL:
            raise RuntimeError(
                "MONGO_URL is not set. Add it to backend/.env"
            )
        _client = AsyncIOMotorClient(MONGO_URL)
    return _client


def get_db():
    client = get_client()
    return client[DB_NAME]


def close_db():
    global _client
    if _client:
        _client.close()
        _client = None


# =========================
# AUDIT LOGGING (STEP 4)
# =========================

async def log_audit(
    db,
    *,
    user_id: str,
    role: str,
    action: str,
    resource: str,
    resource_id: Optional[str] = None,
    meta: Optional[Dict[str, Any]] = None,
):
    """
    Lightweight audit logger.
    Best-effort only: MUST NOT break main workflow.
    """
    try:
        await db.audit_logs.insert_one({
            "user_id": user_id,
            "role": role,
            "action": action,
            "resource": resource,
            "resource_id": resource_id,
            "meta": meta or {},
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    except Exception:
        # Never allow audit logging to break the request
        pass
