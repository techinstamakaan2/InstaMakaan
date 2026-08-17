from datetime import datetime, timezone
from fastapi import HTTPException
from core.database import get_db
from modules.inquiries.schemas import InquiryCreate, InquiryUpdate
import uuid
import httpx

# ── AiSensy Config ──────────────────────────────────────────
AISENSY_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OTgwYWM4N2U4NzhjMGRjMDgzY2NmOSIsIm5hbWUiOiJJbnN0YW1ha2FhbiIsImFwcE5hbWUiOiJBaVNlbnN5IiwiY2xpZW50SWQiOiI2OTk4MGFjODdlODc4YzBkYzA4M2NjZjIiLCJhY3RpdmVQbGFuIjoiRlJFRV9GT1JFVkVSIiwiaWF0IjoxNzcxNTcxOTEyfQ.sA3CPiI8D3ri9Nmsds3CqVwIbmysmCv8aQS0lms6eNs"
AISENSY_CAMPAIGN_NAME = "VisitScheduleWeb"
# ────────────────────────────────────────────────────────────

async def send_whatsapp_via_aisensy(phone: str, name: str, preferred_date: str):
    url = "https://backend.aisensy.com/campaign/t1/api/v2"
    payload = {
        "apiKey": AISENSY_API_KEY,
        "campaignName": AISENSY_CAMPAIGN_NAME,
        "destination": phone,
        "userName": name,
        "templateParams": [name, preferred_date],
        "source": "instamakaan-web",
        "media": {},
        "buttons": [],
        "carouselCards": [],
        "location": {}
    }
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, timeout=10)
            print("AiSensy response:", response.status_code, response.text)
        except Exception as e:
            print("AiSensy error:", str(e))
            # Don't raise — WhatsApp failure should NOT block inquiry creation


async def create_inquiry(data: InquiryCreate):
    db = get_db()
    now = datetime.now(timezone.utc)
    inquiry = data.model_dump()
    inquiry.update({
        "id": str(uuid.uuid4()),
        "stage": "NEW",
        "assigned_agent_id": None,
        "assigned_agent_name": None,
        "notes": [],
        "conversation_logs": [],
        "created_at": now.isoformat(),
        "updated_at": now.isoformat(),
    })
    await db.inquiries.insert_one(inquiry)

    # ── Send WhatsApp only if user opted in ──────────
    if data.whatsapp_opt_in and data.phone:
        clean_phone = data.phone.replace("+", "").replace(" ", "").replace("-", "")
        if not clean_phone.startswith("91") and len(clean_phone) == 10:
            clean_phone = "91" + clean_phone
        await send_whatsapp_via_aisensy(
            phone=clean_phone,
            name=data.name,
            preferred_date=str(data.preferred_date or "your preferred date")
        )
    # ─────────────────────────────────────────────────

    inquiry.pop("_id", None)
    return inquiry


async def list_inquiries(filters: dict, limit: int = 100):
    db = get_db()
    return await db.inquiries.find(filters, {"_id": 0}).sort("created_at", -1).to_list(limit)


async def get_inquiry_by_id(inquiry_id: str):
    db = get_db()
    inquiry = await db.inquiries.find_one({"id": inquiry_id}, {"_id": 0})
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return inquiry


async def update_inquiry(inquiry_id: str, data: InquiryUpdate):
    db = get_db()
    inquiry = await get_inquiry_by_id(inquiry_id)
    update_data = data.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.inquiries.update_one(
        {"id": inquiry_id},
        {"$set": update_data}
    )
    return await get_inquiry_by_id(inquiry_id)


async def assign_agent(inquiry_id: str, agent_id: str, agent_name: str):
    db = get_db()
    log = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "message": f"Assigned to {agent_name}",
        "status_change": "ASSIGNED",
    }
    await db.inquiries.update_one(
        {"id": inquiry_id},
        {
            "$set": {
                "assigned_agent_id": agent_id,
                "assigned_agent_name": agent_name,
                "stage": "ASSIGNED",
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            "$push": {"conversation_logs": log}
        }
    )