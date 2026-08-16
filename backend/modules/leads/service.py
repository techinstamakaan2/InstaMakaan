import uuid
import re
from datetime import datetime
from typing import Dict, List, Optional

from core.database import get_db

from modules.whatsapp.service import (
    send_tenant_property_catalogue,
    send_owner_brochure_message
)
from modules.listings.service import get_listing_by_id

PHONE_REGEX = re.compile(r"^[6-9]\d{9}$")

ALLOWED_STAGES = [
    "NEW",
    "CONTACTED",
    "VISIT_REQUESTED",
    "VISIT_SCHEDULED",
    "VISIT_DONE",
    "CLOSED_WON",
    "CLOSED_LOST",
]

def create_tenant_lead(
    listing_id: str,
    name: str,
    phone: str,
    whatsapp_opt_in: bool,
    action: str,
    source_page: str,
    utm: Optional[dict] = None,
):
    if not PHONE_REGEX.match(phone):
        return None, "Invalid phone number"

    listing = get_listing_by_id(listing_id)
    if not listing or listing.get("status") != "PUBLISHED":
        return None, "Invalid or unpublished listing"

    lead_id = str(uuid.uuid4())

    lead = {
        "id": lead_id,
        "type": "TENANT",
        "listing_id": listing_id,
        "name": name,
        "phone": phone,
        "action": action,
        "source_page": source_page,
        "utm": utm,
        "stage": "NEW",
        "whatsapp_opt_in": whatsapp_opt_in,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "next_followup_at": None,
        "notes": [],

        # WhatsApp tracking
        "whatsapp_consent_at": datetime.utcnow() if whatsapp_opt_in else None,
        "whatsapp_message_id": None,
        "whatsapp_status": None,
        "whatsapp_sent_at": None,
    }

    # Auto-send WhatsApp catalogue
    if whatsapp_opt_in:
        message_id = send_tenant_property_catalogue(lead, listing)
        lead["whatsapp_message_id"] = message_id
        lead["whatsapp_status"] = "sent"
        lead["whatsapp_sent_at"] = datetime.utcnow()

    db = get_db()
    db.leads.insert_one(lead)
    
    # Remove _id before returning to avoid issues
    lead.pop("_id", None)

    return lead, None

def create_owner_lead(
    name: str,
    phone: str,
    city: str,
    whatsapp_opt_in: bool,
    source_page: str,
):
    if not PHONE_REGEX.match(phone):
        return None, "Invalid phone number"

    lead_id = str(uuid.uuid4())

    lead = {
        "id": lead_id,
        "type": "OWNER",
        "name": name,
        "phone": phone,
        "city": city,
        "source_page": source_page,
        "stage": "NEW",
        "whatsapp_opt_in": whatsapp_opt_in,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "next_followup_at": None,
        "notes": [],

        # WhatsApp tracking
        "whatsapp_consent_at": datetime.utcnow() if whatsapp_opt_in else None,
        "whatsapp_message_id": None,
        "whatsapp_status": None,
        "whatsapp_sent_at": None,
    }

    if whatsapp_opt_in:
        message_id = send_owner_brochure_message(lead)
        lead["whatsapp_message_id"] = message_id
        lead["whatsapp_status"] = "sent"
        lead["whatsapp_sent_at"] = datetime.utcnow()

    db = get_db()
    db.leads.insert_one(lead)
    
    lead.pop("_id", None)

    return lead, None

def list_leads(
    lead_type: Optional[str] = None,
    stage: Optional[str] = None,
    listing_id: Optional[str] = None,
):
    filter_query = {}

    if lead_type:
        filter_query["type"] = lead_type.upper()

    if stage:
        filter_query["stage"] = stage

    if listing_id:
        filter_query["listing_id"] = listing_id

    db = get_db()
    results = list(db.leads.find(filter_query, {"_id": 0}))
    return results


def update_lead(
    lead_id: str,
    stage: Optional[str] = None,
    next_followup_at: Optional[datetime] = None,
):
    db = get_db()
    
    update_fields = {"updated_at": datetime.utcnow()}

    if stage:
        if stage not in ALLOWED_STAGES:
            return None
        update_fields["stage"] = stage

    if next_followup_at:
        update_fields["next_followup_at"] = next_followup_at

    result = db.leads.find_one_and_update(
        {"id": lead_id},
        {"$set": update_fields},
        return_document=True
    )
    
    if result:
        result.pop("_id", None)

    return result


def add_lead_note(lead_id: str, note: str):
    db = get_db()
    
    new_note = {
        "note": note,
        "created_at": datetime.utcnow()
    }
    
    result = db.leads.update_one(
        {"id": lead_id},
        {"$push": {"notes": new_note}}
    )
    
    return result.modified_count > 0

