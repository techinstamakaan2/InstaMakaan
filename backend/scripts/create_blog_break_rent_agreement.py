"""
Run this script once from the backend folder:
  python scripts/create_blog_break_rent_agreement.py
Inserts directly into MongoDB — no API auth needed.
"""
import sys, os, asyncio, re
from pathlib import Path
from datetime import datetime

# ── make sure backend packages are importable ─────────────────────────────────
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME   = os.environ.get("DB_NAME", "instamakaan")


blog = {
    "title": "How to Break a Rent Agreement Early in Noida & Greater Noida: Your Complete Legal Guide",
    "slug": "how-to-break-rent-agreement-early-noida",
    "excerpt": "Transferred? Need to move out before your lease ends? This guide explains exactly how to legally exit a rent agreement in Noida, Greater Noida & NCR — covering lock-in periods, notice periods, deposit recovery, and what to do when the owner refuses.",
    "category": "Renting Guide",
    "date": "2026-07-04",
    "readTime": "8 min read",
    "heroImage": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?fm=jpg&q=80&w=1400&auto=format&fit=crop",
    "image": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?fm=jpg&q=80&w=800&auto=format&fit=crop",
    "author": {
        "name": "InstaMakaan Team",
        "role": "Property Experts, Noida NCR"
    },
    "tags": [
        "rent agreement", "break lease", "exit rent agreement", "notice period",
        "lock-in period", "security deposit", "tenant rights", "noida", "greater noida"
    ],
    "toc": [
        "Can You Legally Break a Rent Agreement?",
        "Step 1 — Read Your Agreement First",
        "Lock-In Period vs Notice Period: Key Difference",
        "How to Give Proper Written Notice",
        "Will You Lose Your Security Deposit?",
        "What If the Owner Refuses to Let You Leave?",
        "Breaking Agreement When Owner Is at Fault",
        "How to Handle It If You Have to Leave Urgently",
        "Common Mistakes Tenants Make",
        "FAQ"
    ],
    "keyStats": [
        {"label": "Typical Notice Period", "value": "1 Month",         "icon": "📅"},
        {"label": "Lock-In Period (common)", "value": "3–6 Months",    "icon": "🔒"},
        {"label": "Deposit Risk if Lock-In Broken", "value": "Partial/Full Forfeit", "icon": "💰"},
        {"label": "Registered Agreement?", "value": "12+ Month Leases", "icon": "📜"},
    ],
    "blocks": [
        {
            "type": "section",
            "id": "intro",
            "heading": "Can You Legally Break a Rent Agreement?",
            "body": (
                "<p>Yes — you can break a rent agreement early, but <strong>how</strong> you do it determines whether you lose your security deposit, face a legal notice, or walk away cleanly.</p>"
                "<p>In India, a rent agreement is a legally binding contract. Breaking it without following the correct process can result in:</p>"
                "<ul>"
                "<li>Forfeiture of your full security deposit</li>"
                "<li>Liability to pay rent for the remaining lock-in period</li>"
                "<li>A legal dispute with the owner</li>"
                "</ul>"
                "<p>But if you follow the right steps — read your agreement, give proper notice, and document everything — you can exit legally and recover your deposit.</p>"
                "<p>This guide is written specifically for tenants in <strong>Noida, Greater Noida, Noida Extension, and the wider NCR region</strong>, where rent agreements are governed by the Uttar Pradesh Urban Buildings (Regulation of Letting, Rent & Eviction) Act.</p>"
            )
        },
        {
            "type": "section",
            "id": "read-agreement",
            "heading": "Step 1 — Read Your Rent Agreement First",
            "body": (
                "<p>Before you do anything else, read your rent agreement carefully. Look for three specific clauses:</p>"
                "<h3>1. Lock-In Period Clause</h3>"
                "<p>A lock-in period is a fixed minimum duration during which <em>neither party</em> can terminate the agreement. Common in NCR: <strong>3 to 6 months</strong>. If you leave during the lock-in period, you are typically liable to pay rent until the lock-in ends — even if you have moved out.</p>"
                "<h3>2. Notice Period Clause</h3>"
                "<p>After the lock-in period, either party can exit by giving advance written notice. The standard in NCR is <strong>1 month's notice</strong>, though some agreements specify 2 months. This notice must usually be given in writing.</p>"
                "<h3>3. Early Termination / Penalty Clause</h3>"
                "<p>Some agreements include a specific clause allowing early exit with a penalty — for example, forfeiting 1 month's rent or 50% of the deposit. If your agreement has this clause, it is actually in your favour — it gives you a clear, agreed-upon exit route.</p>"
                "<p><strong>If you cannot find these clauses</strong>, the default rules under UP tenancy law apply — which generally require 1 month written notice after the initial lease period.</p>"
            )
        },
        {
            "type": "section",
            "id": "lock-in-vs-notice",
            "heading": "Lock-In Period vs Notice Period: The Key Difference",
            "body": (
                "<p>Most tenants confuse these two terms. They are very different:</p>"
                "<table><thead><tr><th>Term</th><th>What It Means</th><th>What Happens If You Break It</th></tr></thead>"
                "<tbody>"
                "<tr><td><strong>Lock-In Period</strong></td><td>Minimum period you must stay. Neither party can exit.</td><td>You may owe rent for the remaining lock-in months</td></tr>"
                "<tr><td><strong>Notice Period</strong></td><td>Advance warning you must give before vacating (after lock-in ends)</td><td>You may lose the notice-period rent from your deposit</td></tr>"
                "</tbody></table>"
                "<p><strong>Example:</strong> Your agreement has a 3-month lock-in and 1-month notice period. You want to leave after 2 months.</p>"
                "<ul>"
                "<li>You are inside the lock-in — you owe 1 month's rent (for month 3)</li>"
                "<li>You must still give 1 month's notice</li>"
                "<li>Total liability: up to 2 months' rent</li>"
                "</ul>"
                "<p>If you want to leave after 4 months (lock-in is over), you just need to give 1 month's notice. No penalty.</p>"
            )
        },
        {
            "type": "section",
            "id": "written-notice",
            "heading": "How to Give Proper Written Notice",
            "body": (
                "<p>This is the most important step tenants skip — and the main reason they end up in disputes. Verbal notice has <strong>zero legal value</strong>. Always give notice in writing.</p>"
                "<h3>What your notice letter must include:</h3>"
                "<ul>"
                "<li>Your name and the flat address</li>"
                "<li>Date of the letter</li>"
                "<li>Your intended vacating date (must respect notice period)</li>"
                "<li>A request for the owner to confirm receipt</li>"
                "<li>A request to schedule the final inspection and deposit refund</li>"
                "</ul>"
                "<h3>How to send it:</h3>"
                "<ul>"
                "<li><strong>WhatsApp message</strong> — acceptable and creates a timestamped record. Screenshot and save it.</li>"
                "<li><strong>Email</strong> — best for a clear paper trail</li>"
                "<li><strong>Registered post / Speed Post</strong> — legally strongest; keep the acknowledgement slip</li>"
                "</ul>"
                "<p>Even if the owner verbally agrees, follow it up with a written message: <em>\"As discussed, I am giving formal 1-month notice to vacate the flat on [date].\"</em></p>"
                "<p><strong>Never vacate without written confirmation</strong> — owners have used lack of notice as grounds to withhold deposits even when the tenant gave verbal notice months in advance.</p>"
            )
        },
        {
            "type": "section",
            "id": "security-deposit",
            "heading": "Will You Lose Your Security Deposit?",
            "body": (
                "<p>Whether you get your deposit back depends on three things:</p>"
                "<h3>1. Whether you respected the lock-in period</h3>"
                "<p>If you left during the lock-in, the owner can deduct the rent owed for the remaining lock-in months from your deposit. If the deposit doesn't cover it, they can legally claim the balance.</p>"
                "<h3>2. Whether you gave proper notice</h3>"
                "<p>If you gave written notice and served the full notice period, <strong>the owner cannot withhold your deposit</strong> on that ground.</p>"
                "<h3>3. Condition of the flat at handover</h3>"
                "<p>Normal wear and tear (small nail holes, faded paint) cannot be deducted. But damages beyond normal use can be deducted — which is why doing a <strong>joint inspection</strong> at handover is critical.</p>"
                "<h3>Best practice for getting your full deposit back:</h3>"
                "<ul>"
                "<li>Give notice in writing, respecting the notice period</li>"
                "<li>Pay all pending utility bills before vacating</li>"
                "<li>Do a joint walk-through with the owner and take photos and video</li>"
                "<li>Get a signed handover receipt confirming the flat was returned in good condition</li>"
                "<li>Follow up in writing asking for deposit refund within a specific date (typically 15–30 days)</li>"
                "</ul>"
                "<p>In NCR, it is standard for deposits to be returned within <strong>15–30 days</strong> of vacating. If the owner delays beyond 30 days without reason, you have legal recourse.</p>"
            )
        },
        {
            "type": "section",
            "id": "owner-refuses",
            "heading": "What If the Owner Refuses to Let You Leave?",
            "body": (
                "<p>In India, an owner cannot physically stop you from leaving or force you to stay beyond your notice period. But they can make things difficult — by withholding keys, refusing to do the handover inspection, or threatening legal action.</p>"
                "<h3>If the owner is being uncooperative:</h3>"
                "<ol>"
                "<li><strong>Send a formal written notice</strong> via registered post to the owner stating your vacating date and requesting the handover</li>"
                "<li><strong>Vacate on your stated date</strong> regardless. Take dated photos and video of every room, including meter readings</li>"
                "<li><strong>Hand over the keys</strong> via registered post if the owner refuses to accept them in person. Keep the courier receipt</li>"
                "<li><strong>Send a final demand notice</strong> for deposit refund by a specific date, via registered post</li>"
                "<li>If no response: you can approach the <strong>Rent Control Court</strong> or file a consumer complaint. In most NCR cases, a formal legal notice from an advocate is enough to prompt the owner to settle</li>"
                "</ol>"
                "<p>The process sounds intimidating but most disputes are resolved once the owner sees a formal legal notice. Very few go to court.</p>"
            )
        },
        {
            "type": "section",
            "id": "owner-at-fault",
            "heading": "Breaking Agreement When the Owner Is at Fault",
            "body": (
                "<p>If you are leaving because the owner is violating the agreement, you may be able to exit <em>without</em> penalty — even during the lock-in period.</p>"
                "<h3>Valid grounds for immediate exit at owner's fault:</h3>"
                "<ul>"
                "<li>Owner repeatedly entering the flat without prior notice or permission</li>"
                "<li>Serious structural damage (ceiling collapse, waterlogging) that the owner refuses to repair</li>"
                "<li>Cutting off electricity, water, or other amenities</li>"
                "<li>Illegal rent hike mid-tenancy without written agreement</li>"
                "<li>Owner has sold the property and is harassing you to vacate</li>"
                "</ul>"
                "<h3>What to do:</h3>"
                "<ul>"
                "<li>Document every incident — WhatsApp messages, emails, photos, dates</li>"
                "<li>Send a written notice to the owner citing the specific violations</li>"
                "<li>State clearly that you are terminating the agreement due to their breach</li>"
                "<li>Vacate with a full handover and demand your deposit in writing</li>"
                "</ul>"
                "<p>In these cases, a court would typically side with the tenant if the documentation is strong.</p>"
            )
        },
        {
            "type": "section",
            "id": "urgent-exit",
            "heading": "How to Handle It If You Have to Leave Urgently",
            "body": (
                "<p>Job transfers, medical emergencies, or family situations sometimes mean you cannot serve the full notice period. Here is how to handle it:</p>"
                "<h3>Option 1: Negotiate with the owner</h3>"
                "<p>Be honest. Most owners in NCR are practical people. If you explain the situation and offer to:</p>"
                "<ul>"
                "<li>Help find a replacement tenant</li>"
                "<li>Give a shorter notice but forfeit 1 month from the deposit as compensation</li>"
                "</ul>"
                "<p>Many owners will agree. Get any such deal in writing via WhatsApp or email.</p>"
                "<h3>Option 2: Find a replacement tenant yourself</h3>"
                "<p>If the owner agrees, finding a new tenant before you leave is the cleanest exit. The owner gets continuity; you get your deposit back faster.</p>"
                "<h3>Option 3: Accept the penalty clause</h3>"
                "<p>If your agreement has an early exit penalty (common: 1–2 months' rent or partial deposit), accepting it and moving on is often faster and cheaper than a prolonged dispute.</p>"
                "<p>At <strong>InstaMakaan</strong>, we mediate between tenants and owners in exactly these situations — helping both parties reach a fair resolution without going to court.</p>"
            )
        },
        {
            "type": "section",
            "id": "common-mistakes",
            "heading": "Common Mistakes Tenants Make When Breaking an Agreement",
            "body": (
                "<p>These mistakes cost tenants their deposit and create unnecessary disputes:</p>"
                "<ul>"
                "<li>🚫 <strong>Leaving without any written notice</strong> — the most common mistake. Always document it</li>"
                "<li>🚫 <strong>Vacating without a joint inspection</strong> — leaves you with no proof of the flat's condition at handover</li>"
                "<li>🚫 <strong>Leaving pending bills unpaid</strong> — electricity, society maintenance, and water dues will be deducted from your deposit</li>"
                "<li>🚫 <strong>Not taking photos before you vacate</strong> — owners sometimes claim damages that were pre-existing</li>"
                "<li>🚫 <strong>Trusting verbal promises about deposit refund</strong> — always get a date and written confirmation</li>"
                "<li>🚫 <strong>Assuming the owner will \"manage\" the handover</strong> — you must actively drive the process: notice → inspection → handover → deposit follow-up</li>"
                "<li>🚫 <strong>Abandoning the flat without handing over keys</strong> — this can expose you to claims of continued rent liability</li>"
                "</ul>"
            )
        },
        {
            "type": "section",
            "id": "instamakaan-note",
            "heading": "How InstaMakaan Helps With Smooth Exits",
            "body": (
                "<p>At InstaMakaan, we understand that life doesn't always follow a rent agreement calendar. Our managed rental service includes:</p>"
                "<ul>"
                "<li>✅ <strong>Agreement drafting</strong> with fair exit clauses for both tenant and owner</li>"
                "<li>✅ <strong>Notice period tracking</strong> — we remind both parties when notice windows are approaching</li>"
                "<li>✅ <strong>Handover inspection</strong> — we conduct a professional joint inspection and document the flat condition</li>"
                "<li>✅ <strong>Deposit mediation</strong> — if there is a dispute, we step in as a neutral party</li>"
                "<li>✅ <strong>Replacement tenant search</strong> — if you need to exit early, we proactively help find a new tenant</li>"
                "</ul>"
                "<p>Whether you are in Noida Extension, Sector 62, Sector 137, Greater Noida West, or Indirapuram — our team handles the entire exit process so you can focus on your move, not the paperwork.</p>"
            )
        }
    ],
    "faqs": [
        {
            "q": "Can I break my rent agreement before the lock-in period ends?",
            "a": "Technically yes — no one can stop you from leaving. But you may be liable to pay rent for the remaining lock-in months and could forfeit all or part of your security deposit. Check your agreement for an early exit penalty clause, which may provide a cleaner path."
        },
        {
            "q": "How much notice do I need to give to break a rent agreement in Noida?",
            "a": "The standard notice period in NCR is 1 month, though your specific agreement may say 2 months. The notice must be given in writing — WhatsApp, email, or registered post. Verbal notice has no legal value."
        },
        {
            "q": "Can the owner keep my security deposit if I break the agreement early?",
            "a": "If you leave during the lock-in period, the owner can deduct the rent owed for the remaining lock-in months. If you respected the lock-in and gave proper notice, the owner cannot withhold your deposit except for genuine damages to the property."
        },
        {
            "q": "What if my employer is transferring me and I need to break the agreement immediately?",
            "a": "A job transfer letter is a valid reason for early exit. Show it to your owner and negotiate — most owners are willing to waive the lock-in penalty or shorten the notice period in case of transfer. Put any agreement in writing."
        },
        {
            "q": "Can I break a rent agreement if the owner is not maintaining the property?",
            "a": "Yes — if the owner is in breach of the agreement (not fixing major repairs, entering without notice, cutting utilities), you can terminate the agreement due to owner's fault. Document all incidents and send a written notice before vacating."
        },
        {
            "q": "How long should the owner take to return my security deposit after I vacate?",
            "a": "The standard in NCR is 15–30 days after handover. If the owner delays beyond 30 days without reason, send a formal demand notice. If still no response, you can approach the Rent Control Court or file a consumer complaint."
        },
        {
            "q": "Does the rent agreement need to be cancelled officially if I leave early?",
            "a": "For 11-month unregistered agreements, there is no formal cancellation process — the written notice and handover receipt are sufficient. For registered long-term leases, a formal deed of surrender may be needed, usually drafted by a lawyer."
        },
        {
            "q": "What is the process to hand over the flat?",
            "a": "1. Do a joint inspection with the owner. 2. Take photos and video of every room, including meter readings. 3. Clear all pending bills. 4. Get a signed handover receipt. 5. Hand over all keys. 6. Follow up in writing asking for deposit refund date."
        }
    ],
    "status": "published"
}


async def main():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    collection = db["blogs"]

    # Check if slug already exists
    existing = await collection.find_one({"slug": blog["slug"]})
    if existing:
        print(f"⚠️  Blog with slug '{blog['slug']}' already exists — skipping insert.")
        client.close()
        return

    # Resolve heroImage → image
    hero = blog.pop("heroImage", None)
    if not blog.get("image") and hero:
        blog["image"] = hero

    blog["created_at"] = datetime.utcnow()
    blog["updated_at"] = datetime.utcnow()
    blog.setdefault("views", 0)

    result = await collection.insert_one(blog)
    created = await collection.find_one({"_id": result.inserted_id})

    print(f"✅ Blog created successfully!")
    print(f"   ID   : {result.inserted_id}")
    print(f"   Slug : {created.get('slug')}")
    print(f"   URL  : https://instamakaan.com/blog/{created.get('slug')}")
    client.close()


if __name__ == "__main__":
    asyncio.run(main())
