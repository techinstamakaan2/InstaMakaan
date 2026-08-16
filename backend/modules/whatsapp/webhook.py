from fastapi import APIRouter, Request
from datetime import datetime, timezone
from core.database import get_db

router = APIRouter(
    prefix="/integrations/whatsapp",
    tags=["WhatsApp"]
)


@router.post("/webhook")
async def whatsapp_webhook(request: Request):
    """
    Receives WhatsApp delivery/read callbacks.
    Expected payload (example):
    {
        "message_id": "TENANT_xxx",
        "status": "delivered" | "read"
    }
    """

    payload = await request.json()

    message_id = payload.get("message_id")
    status = payload.get("status")

    if not message_id or not status:
        return {"ok": True}

    db = get_db()
    await db.leads.update_one(
        {"whatsapp_message_id": message_id},
        {"$set": {
            "whatsapp_status": status,
            "updated_at": datetime.now(timezone.utc)
        }}
    )

    return {"ok": True}
