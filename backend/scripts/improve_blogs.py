"""
Improves all blogs EXCEPT pg-full-form-in-hostel and 1bhk-vs-2bhk.
Changes:
  1. Adds meta_description to all 6 blogs (biggest CTR improvement)
  2. Adds 3 more FAQs to Tenant Rights blog (5 → 8)
  3. Adds 3 more FAQs to Moving to Noida blog (5 → 8)
  4. Removes "no brokerage runaround" from Moving to Noida blog content
"""
import sys, os, asyncio, re
from pathlib import Path
from datetime import datetime
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parent.parent / ".env")
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME   = os.environ.get("DB_NAME", "instamakaan")

# ── Meta descriptions (max ~155 chars — optimised for Google CTR) ─────────────
META_DESCRIPTIONS = {
    "best-area-to-rent-in-noida-extension-2026":
        "Find the best area to rent in Noida Extension in 2026. Compare Gaur City, Techzone 4 & more — with real rent prices, metro connectivity and what to check before moving.",

    "documents-checklist-renting-flat-noida-extension":
        "Complete documents checklist for renting a flat in Noida Extension 2026. Know exactly what tenants & owners must submit — Aadhaar, NOC, agreement, police verification & more.",

    "noida-extension-vs-siddharth-vihar-which-is-better-to-rent-in-for-2026":
        "Noida Extension vs Siddharth Vihar — which is better to rent in 2026? Compare rents, metro connectivity, schools, air quality and future growth to make the right call.",

    "moving-noida-new-job-neighbourhood-guide":
        "Relocating to Noida for an IT or corporate job? This neighbourhood guide covers the best areas near Sector 62, 137 & Expressway — with real 2026 rent figures and commute times.",

    "tenant-rights-india-what-every-renter-must-know":
        "Know your legal rights as a tenant in India before signing. Security deposit limits, illegal eviction rules, maintenance duties & how to resolve landlord disputes — explained simply.",

    "how-to-break-rent-agreement-early-noida":
        "Need to break your rent agreement early in Noida? Step-by-step guide — lock-in period rules, notice letter format, security deposit recovery & what to do if the owner refuses.",
}

# ── Extra FAQs for Tenant Rights (currently has 5, target 8) ─────────────────
TENANT_RIGHTS_EXTRA_FAQS = [
    {
        "q": "What if my landlord refuses to give me a rent receipt?",
        "a": "You have a legal right to demand a rent receipt for every payment. Without receipts, proving your payments becomes difficult in a dispute. Always pay rent via bank transfer or UPI — this creates an automatic digital record. Save all WhatsApp or email conversations about payments as supporting evidence."
    },
    {
        "q": "Can a landlord ask for more than 2 months as security deposit in Noida?",
        "a": "Under the Model Tenancy Act 2021, the maximum security deposit for residential property is 2 months rent. However, until Uttar Pradesh formally adopts this Act, landlords can technically demand more. If you agree to pay a higher deposit, ensure the exact amount is documented in the agreement and get a signed receipt for every payment."
    },
    {
        "q": "Does the rent agreement need to be on stamp paper in Noida?",
        "a": "For agreements of 11 months or less in Uttar Pradesh (which covers Noida and Greater Noida), the agreement must be on stamp paper of minimum ₹100 but does not require formal registration. For agreements above 11 months, registration at the Sub-Registrar office is mandatory. A registered agreement provides the strongest legal protection for both parties."
    },
]

# ── Extra FAQs for Moving to Noida (currently has 5, target 8) ───────────────
MOVING_NOIDA_EXTRA_FAQS = [
    {
        "q": "How much should I budget for rent in Noida as a first-time renter?",
        "a": "A good rule of thumb is 25–30% of your monthly in-hand salary. If you earn ₹40,000 per month, target flats in the ₹10,000–12,000 range. Add ₹2,000–4,000 per month for maintenance and electricity on top. Noida Extension and Sector 62 offer the best value for freshers and mid-level professionals starting out."
    },
    {
        "q": "Is it better to rent a furnished or unfurnished flat when relocating to Noida?",
        "a": "Furnished flats cost ₹3,000–6,000 more per month but save you the upfront investment in furniture and appliances. If you are relocating alone for the first time, semi-furnished or fully furnished is usually the smarter choice for the first 6–12 months. Unfurnished makes more sense if you plan to stay 2+ years and already own furniture."
    },
    {
        "q": "How long does it typically take to find and move into a flat in Noida?",
        "a": "With a clear budget and preferred location in mind, most renters find a suitable flat within 1–2 weeks. Add 3–5 days for agreement signing, police verification paperwork, and the actual move. Plan at least 2–3 weeks from your joining date so you are not rushing into a flat you have not had time to check properly."
    },
]


async def main():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    for slug, meta_desc in META_DESCRIPTIONS.items():
        update = {
            "meta_description": meta_desc,
            "updated_at": datetime.utcnow()
        }

        # ── Tenant Rights: append extra FAQs ──────────────────────────────────
        if slug == "tenant-rights-india-what-every-renter-must-know":
            blog = await db.blogs.find_one({"slug": slug}, {"faqs": 1})
            existing_faqs = blog.get("faqs", []) if blog else []
            update["faqs"] = existing_faqs + TENANT_RIGHTS_EXTRA_FAQS
            print(f"  Adding 3 FAQs to Tenant Rights ({len(existing_faqs)} → {len(update['faqs'])})")

        # ── Moving to Noida: append extra FAQs + fix brokerage text ──────────
        if slug == "moving-noida-new-job-neighbourhood-guide":
            blog = await db.blogs.find_one({"slug": slug}, {"faqs": 1, "blocks": 1, "sections": 1})
            existing_faqs = blog.get("faqs", []) if blog else []
            update["faqs"] = existing_faqs + MOVING_NOIDA_EXTRA_FAQS
            print(f"  Adding 3 FAQs to Moving to Noida ({len(existing_faqs)} → {len(update['faqs'])})")

            # Fix brokerage text in blocks/sections
            old_phrase = "with actual photos, honest pricing, and no brokerage runaround"
            new_phrase = "with actual photos, honest pricing, and direct access to property owners"

            for field in ("blocks", "sections"):
                items = blog.get(field) or []
                updated_items = []
                changed = False
                for item in items:
                    body = item.get("body", "")
                    if old_phrase in body:
                        item = {**item, "body": body.replace(old_phrase, new_phrase)}
                        changed = True
                    updated_items.append(item)
                if changed:
                    update[field] = updated_items
                    print(f"  Fixed 'no brokerage runaround' in Moving to Noida ({field})")

        result = await db.blogs.update_one({"slug": slug}, {"$set": update})
        status = "✅ updated" if result.matched_count else "❌ NOT FOUND"
        print(f"{status}: {slug}")
        print(f"   meta_description: {meta_desc[:80]}...")

    print("\nDone. All 6 blogs improved.")
    client.close()

asyncio.run(main())
