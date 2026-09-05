"""
Seed Script for High-Traffic Real Estate SEO Blogs
Run this script from the backend folder when your virtual environment is active:
  python scripts/seed_seo_blogs.py

Inserts 3 high-ranking articles into MongoDB:
1. Online Police Verification for Tenants in Noida & Greater Noida (UP Cop App 2026)
2. Gaur City 1 vs Gaur City 2: Rent, Maintenance & Metro Commute Comparison (2026)
3. How to Rent Out Your Flat in Noida Extension 2x Faster Without Brokerage (Owner's Guide 2026)
"""

import sys, os, asyncio
from pathlib import Path
from datetime import datetime, timezone

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME   = os.environ.get("DB_NAME", "instamakaan")

SEO_BLOGS = [
    {
        "title": "Online Police Verification for Tenants in Noida & Greater Noida: Step-by-Step UP Cop App Guide (2026)",
        "slug": "online-police-verification-tenants-noida-up-cop",
        "excerpt": "Complete step-by-step guide to online tenant police verification in Noida & Greater Noida using UP Cop App. Avoid landlord disputes, fines & delays in 2026.",
        "meta_description": "Complete step-by-step guide to online tenant police verification in Noida & Greater Noida using UP Cop App. Avoid landlord disputes, fines & delays in 2026.",
        "category": "For Tenants",
        "date": "2026-09-01",
        "readTime": "6 min read",
        "heroImage": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?fm=jpg&q=80&w=1400&auto=format&fit=crop",
        "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?fm=jpg&q=80&w=800&auto=format&fit=crop",
        "author": {
            "name": "InstaMakaan Team",
            "role": "Legal & Property Advisory, Noida NCR"
        },
        "tags": [
            "police verification", "up cop app", "tenant verification noida",
            "greater noida tenant", "noida extension police verification", "rent agreement", "tenant rights"
        ],
        "toc": [
            "Why Police Verification is Mandatory in Noida NCR",
            "Required Documents for UP Cop App Verification",
            "Step-by-Step Guide to Verify Online via UP Cop App",
            "Fee, Processing Time & Verification Status Check",
            "What Happens If You Skip Verification?",
            "Common Mistakes & FAQs"
        ],
        "keyStats": [
            {"label": "Government Fee", "value": "₹50 (Online)", "icon": "💳"},
            {"label": "Average Approval", "value": "7–14 Days", "icon": "⏱️"},
            {"label": "Mode", "value": "100% Online (UP Cop)", "icon": "📱"},
            {"label": "Legal Penalty for Skipping", "value": "Section 188 IPC Fine", "icon": "⚠️"}
        ],
        "blocks": [
            {
                "type": "section",
                "id": "intro",
                "heading": "Why Police Verification is Mandatory in Noida NCR",
                "body": (
                    "<p>If you are renting a flat in <strong>Noida, Greater Noida, or Noida Extension</strong>, tenant police verification is not an optional formality — it is a <strong>mandatory legal requirement</strong> ordered by the Gautam Buddha Nagar Police Commissionerate.</p>"
                    "<p>Skipping tenant verification is a punishable offense under <strong>Section 188 of the Indian Penal Code (IPC)</strong> for property owners, leading to fines or legal notices. For tenants, high-rise gated societies will deny move-in gate passes and lift access until verification proof is submitted to the Apartment Owners Association (AOA).</p>"
                    "<p>The good news: You no longer need to stand in line at local police stations. The Uttar Pradesh Police provides the <strong>UP Cop mobile application</strong> and web portal, allowing 100% digital submission from your smartphone.</p>"
                )
            },
            {
                "type": "section",
                "id": "docs",
                "heading": "Required Documents for UP Cop App Verification",
                "body": (
                    "<p>Keep clear digital photos (JPEG or PDF under 200 KB) ready before starting the app:</p>"
                    "<ul>"
                    "<li><strong>Tenant's Photo:</strong> Passport-size clean photograph with clear face visibility.</li>"
                    "<li><strong>Tenant's Identity Proof:</strong> Aadhaar Card, Voter ID, Driving Licence, or Passport.</li>"
                    "<li><strong>Tenant's Permanent Address Proof:</strong> Aadhaar or Passport with native address.</li>"
                    "<li><strong>Landlord's Details:</strong> Full name, contact number, and Noida property address.</li>"
                    "<li><strong>Office / College Proof:</strong> Tenant's employee ID card or student ID.</li>"
                    "<li><strong>Signed Rent Agreement:</strong> Scanned copy of the first and signature pages.</li>"
                    "</ul>"
                )
            },
            {
                "type": "section",
                "id": "step-by-step",
                "heading": "Step-by-Step Guide to Verify Online via UP Cop App",
                "body": (
                    "<ol>"
                    "<li><strong>Download UP Cop App:</strong> Install the official 'UP Cop' app from Google Play Store or Apple App Store.</li>"
                    "<li><strong>Register / Login:</strong> Enter your mobile number, verify via OTP, and log into the portal.</li>"
                    "<li><strong>Navigate to Verification Services:</strong> Under Services, click on <em>'Tenant Verification' (किरायेदार सत्यापन)</em>.</li>"
                    "<li><strong>Fill Property Owner Details:</strong> Enter the owner's legal name, permanent address, and contact number.</li>"
                    "<li><strong>Fill Tenant Details:</strong> Enter the tenant's full legal name, father's name, gender, date of birth, occupation, and permanent home address.</li>"
                    "<li><strong>Upload Documents:</strong> Upload the passport photo, Aadhaar card, and rent agreement copy.</li>"
                    "<li><strong>Pay the ₹50 Challan Fee:</strong> Pay the statutory ₹50 state government processing fee online via UPI, debit card, or net banking.</li>"
                    "<li><strong>Save the Application Number:</strong> Download the payment acknowledgment slip with the unique 16-digit Application ID.</li>"
                    "</ol>"
                )
            },
            {
                "type": "section",
                "id": "status",
                "heading": "Fee, Processing Time & Verification Status Check",
                "body": (
                    "<p>The official processing fee is <strong>₹50</strong> per tenant application. Never pay agents ₹500–₹1,000 for this service when it takes less than 10 minutes on your phone.</p>"
                    "<p>The local police station in Noida/Greater Noida will conduct a background check and verify records within <strong>7 to 14 business days</strong>. You can check the live tracking status anytime in the UP Cop app under 'Search Application Status'.</p>"
                    "<p>Once marked 'Verified', download the signed digital certificate. Submit one printed copy to your society estate management office to receive your society entry RFID tags and move-in permission.</p>"
                )
            },
            {
                "type": "section",
                "id": "instamakaan",
                "heading": "Renting Hassle-Free with InstaMakaan",
                "body": (
                    "<p>At <a href='https://instamakaan.com'>InstaMakaan</a>, our managed rental services take care of the entire move-in paperwork for tenants and homeowners. From legally compliant 11-month rental agreements on verified stamp paper to coordinating police verification submissions, we ensure zero broker friction and complete peace of mind.</p>"
                    "<p>Looking for verified flats in Noida? <a href='https://instamakaan.com/all-properties'>Browse verified flats for rent in Noida & Greater Noida</a>.</p>"
                )
            }
        ],
        "faqs": [
            {
                "q": "Who is responsible for doing police verification: tenant or owner?",
                "a": "Legally, the responsibility lies with the property owner. However, in practice, either the owner, property manager, or tenant can fill out the UP Cop application with the required documents and consent."
            },
            {
                "q": "Is police verification mandatory for bachelors living in PGs or flats in Noida?",
                "a": "Yes. Gated societies and local police mandates strictly enforce verification for all tenants, including students and working bachelors living in individual flats or shared co-living spaces."
            },
            {
                "q": "How long is the UP Cop tenant verification certificate valid?",
                "a": "The verification is valid for the duration of the current tenancy (typically 11 months as per the standard lease deed). If the lease is renewed or the tenant shifts to a new flat, fresh verification is required."
            },
            {
                "q": "Can the police physically visit the rented flat during verification?",
                "a": "In most routine cases, digital record checks are completed without a visit. Occasionally, beat constables may visit or call the tenant/owner to cross-verify identification and employment details."
            },
            {
                "q": "What is the penalty if landlord does not complete police verification?",
                "a": "Under Section 188 of IPC, failure to follow police commissionerate directives can lead to a formal police summons, monetary penalties, or even simple imprisonment for up to one month."
            }
        ],
        "status": "published"
    },
    {
        "title": "Gaur City 1 vs Gaur City 2: Honest Rent, Maintenance Charges & Commute Comparison (2026)",
        "slug": "gaur-city-1-vs-gaur-city-2-rent-maintenance-comparison",
        "excerpt": "Comparing Gaur City 1 vs Gaur City 2 in Greater Noida West. Real rent rates, monthly maintenance, parking, water quality & metro commute breakdown for 2026.",
        "meta_description": "Comparing Gaur City 1 vs Gaur City 2 in Greater Noida West. Real rent rates, monthly maintenance, parking, water quality & metro commute breakdown for 2026.",
        "category": "Real Estate",
        "date": "2026-09-02",
        "readTime": "8 min read",
        "heroImage": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?fm=jpg&q=80&w=1400&auto=format&fit=crop",
        "image": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?fm=jpg&q=80&w=800&auto=format&fit=crop",
        "author": {
            "name": "InstaMakaan Team",
            "role": "Noida Extension Property Specialists"
        },
        "tags": [
            "gaur city 1", "gaur city 2", "gaur city rent", "greater noida west",
            "noida extension", "flats for rent noida extension", "rental comparison"
        ],
        "toc": [
            "Overview: Gaur City Township",
            "Rent Price Comparison (1 BHK, 2 BHK, 3 BHK)",
            "Maintenance Charges & Power Backup Reality",
            "Commute & Metro Connectivity to Noida & Delhi",
            "Commercial Hubs, Markets & Daily Life",
            "Which One Should You Choose in 2026?",
            "Frequently Asked Questions"
        ],
        "keyStats": [
            {"label": "2 BHK Average Rent", "value": "₹15,000 – ₹19,000", "icon": "🏠"},
            {"label": "Sector 52 Metro Distance", "value": "12–15 Mins", "icon": "🚇"},
            {"label": "Gaur City Mall Location", "value": "Gaur City 1 (Char Murti)", "icon": "🛍️"},
            {"label": "Typical Security Deposit", "value": "1–2 Months Rent", "icon": "💰"}
        ],
        "blocks": [
            {
                "type": "section",
                "id": "overview",
                "heading": "Overview: The Gaur City Township in Greater Noida West",
                "body": (
                    "<p>Spread across more than 230 acres in Greater Noida West (popularly known as Noida Extension), the Gaur City township is home to over 100,000 residents. Divided primarily into <strong>Gaur City 1 (Sectors 4 & 16C)</strong> and <strong>Gaur City 2 (Sector 16C)</strong> by the main arterial road, choosing the right side can save you up to 30 minutes of daily traffic and ₹2,000 to ₹4,000 in monthly expenses.</p>"
                    "<p>Both phases feature high-rise societies with dedicated sports complexes, international schools, and internal shopping avenues. Here is an honest, data-backed comparison based on hundreds of tenants we have assisted at InstaMakaan.</p>"
                )
            },
            {
                "type": "section",
                "id": "rent-table",
                "heading": "Rent Price Comparison: Gaur City 1 vs Gaur City 2 (2026)",
                "body": (
                    "<p>Rental rates differ depending on proximity to Gaur City Mall, Kisan Chowk (Char Murti), and flat furnishing status:</p>"
                    "<table>"
                    "<thead><tr><th>Configuration</th><th>Gaur City 1 (Semi-Furnished)</th><th>Gaur City 2 (Semi-Furnished)</th><th>Expected Deposit</th></tr></thead>"
                    "<tbody>"
                    "<tr><td><strong>1 BHK / 1 RK</strong></td><td>₹9,000 – ₹11,500/mo</td><td>₹8,500 – ₹10,500/mo</td><td>1 Month Rent</td></tr>"
                    "<tr><td><strong>2 BHK (850–1050 sq ft)</strong></td><td>₹15,500 – ₹19,000/mo</td><td>₹14,000 – ₹17,500/mo</td><td>1–2 Months Rent</td></tr>"
                    "<tr><td><strong>3 BHK (1300–1600 sq ft)</strong></td><td>₹21,000 – ₹26,000/mo</td><td>₹19,000 – ₹23,500/mo</td><td>2 Months Rent</td></tr>"
                    "<tr><td><strong>Fully Furnished (2 BHK)</strong></td><td>₹21,000 – ₹25,000/mo</td><td>₹19,500 – ₹23,000/mo</td><td>2 Months Rent</td></tr>"
                    "</tbody>"
                    "</table>"
                    "<p><em>Note: Society maintenance (₹1.80 to ₹2.60 per sq ft) is usually charged extra by the society AOA or landlord.</em></p>"
                )
            },
            {
                "type": "section",
                "id": "commute",
                "heading": "Commute & Metro Connectivity to Noida & Delhi",
                "body": (
                    "<p>Your daily commute is the biggest deciding factor:</p>"
                    "<ul>"
                    "<li><strong>Gaur City 1 Advantage:</strong> Directly touches <em>Kisan Chowk (Char Murti)</em>. When commuting to Noida Sector 62, 52 Metro Station, or Central Noida via the Parthala Flyover, exiting Gaur City 1 is 5 to 10 minutes faster during morning peak hours.</li>"
                    "<li><strong>Gaur City 2 Traffic Reality:</strong> Gaur City 2 sits slightly deeper in Sector 16C. During peak hours (8:30 AM to 10:30 AM), navigating internal roundabouts can add 10 to 15 minutes before you hit the main highway.</li>"
                    "<li><strong>Metro Distance:</strong> Both phases are roughly 6.5 to 7.5 km from Sector 52 Noida Metro Station (Blue Line) and Sector 51 Metro Station (Aqua Line). Shared electric autos and feeder buses are easily available at ₹20–₹30 per seat.</li>"
                    "</ul>"
                )
            },
            {
                "type": "section",
                "id": "lifestyle",
                "heading": "Commercial Hubs, Markets & Daily Life",
                "body": (
                    "<p>Gaur City 1 houses the iconic <strong>Gaur City Mall</strong>, Wave Cinemas, major retail fashion brands, and multi-cuisine food courts. If you value being walking distance to weekend dining and movie entertainment, Gaur City 1 is unmatched.</p>"
                    "<p>On the other hand, Gaur City 2 features vibrant high-street daily markets like <strong>Gaur City Plaza</strong>, grocery stores, pharmacies, local milk booths, and specialized tuition centers. It is notably quieter, less commercial, and preferred by families with small school-going children.</p>"
                )
            },
            {
                "type": "section",
                "id": "verdict",
                "heading": "Which One Should You Choose in 2026?",
                "body": (
                    "<p><strong>Choose Gaur City 1 if:</strong> You commute daily to Delhi or Noida Sector 62, work flexible shifts, want immediate access to Gaur City Mall, and do not mind paying 5–10% higher rent for location convenience.</p>"
                    "<p><strong>Choose Gaur City 2 if:</strong> You work from home or have hybrid shifts, want maximum square footage for your budget, and prefer a calmer residential environment with slightly lower maintenance charges.</p>"
                    "<p>Ready to explore available flats? Check our verified listings in <a href='https://instamakaan.com/rent/flats-for-rent-in-greater-noida-west'>flats for rent in Greater Noida West</a>.</p>"
                )
            }
        ],
        "faqs": [
            {
                "q": "What are the average maintenance charges in Gaur City societies?",
                "a": "Maintenance charges generally range between ₹2,000 and ₹3,500 per month for a 2 BHK (calculated at approx. ₹2.00 to ₹2.60 per square foot), covering 24x7 security, high-speed lifts, common area lighting, and clubhouse maintenance."
            },
            {
                "q": "Is power backup 24x7 in Gaur City societies?",
                "a": "Yes, almost all high-rise towers in Gaur City 1 and Gaur City 2 have dedicated dual-meter DG power backup systems with automatic changeovers during grid supply interruptions."
            },
            {
                "q": "Are bachelors and students allowed to rent flats in Gaur City?",
                "a": "Yes, many societies permit bachelor and corporate tenants, though some individual societies have specific guidelines requiring police verification and tenant registry with the society maintenance office."
            },
            {
                "q": "Is drinking water quality good in Gaur City?",
                "a": "Like most parts of Greater Noida West, society tap water has a high TDS level (typically 800–1200 ppm). Every flat uses an RO water purifier, or residents subscribe to branded 20-litre water jar deliveries."
            }
        ],
        "status": "published"
    },
    {
        "title": "How to Rent Out Your Flat in Noida Extension 2x Faster Without Brokerage: Owner's Guide (2026)",
        "slug": "how-to-rent-flat-fast-noida-extension-owners-guide",
        "excerpt": "Struggling with flat vacancy in Greater Noida West? Learn how owners can find verified tenants 2x faster, price rent accurately & avoid brokerage in 2026.",
        "meta_description": "Struggling with flat vacancy in Greater Noida West? Learn how owners can find verified tenants 2x faster, price rent accurately & avoid brokerage in 2026.",
        "category": "For Owners",
        "date": "2026-09-03",
        "readTime": "7 min read",
        "heroImage": "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?fm=jpg&q=80&w=1400&auto=format&fit=crop",
        "image": "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?fm=jpg&q=80&w=800&auto=format&fit=crop",
        "author": {
            "name": "InstaMakaan Team",
            "role": "Property Management Specialists"
        },
        "tags": [
            "property owners", "rent out flat", "noida extension", "tenant screening",
            "no brokerage", "property management noida", "rental yield"
        ],
        "toc": [
            "The Cost of a Vacant Flat in Noida Extension",
            "Step 1: Benchmark and Price Your Rent Realistically",
            "Step 2: High-Converting Photography & Video Walkthrough",
            "Step 3: Screen Tenants for Financial & Background Stability",
            "Step 4: Draft an Enforceable 11-Month Rental Agreement",
            "How InstaMakaan Helps Owners Rent Stress-Free",
            "Owner FAQs"
        ],
        "keyStats": [
            {"label": "Average Vacancy Cost", "value": "₹18,000/Month Lost", "icon": "💸"},
            {"label": "Ideal Turnaround Time", "value": "7–12 Days", "icon": "⚡"},
            {"label": "Target Security Deposit", "value": "2 Months Rent", "icon": "🔒"},
            {"label": "Rental Appreciation (NCR)", "value": "8–12% Yearly", "icon": "📈"}
        ],
        "blocks": [
            {
                "type": "section",
                "id": "vacancy-cost",
                "heading": "The Real Cost of Keeping Your Flat Vacant",
                "body": (
                    "<p>Every month your residential flat sits vacant in Noida Extension, you are losing more than just monthly rent. You are paying ongoing society maintenance (₹2,500–₹4,000), fixed electricity meter charges, and EMI interest on your home loan.</p>"
                    "<p>Holding out for an extra ₹1,000 per month often backfires: if your flat stays vacant for 2 extra months waiting for ₹18,000 instead of ₹17,000, you lose ₹34,000 in cash flow that takes nearly three full years to recover!</p>"
                    "<p>This practical guide outlines how successful homeowners in Noida Extension close leases within 10 days while securing high-quality, verified tenants.</p>"
                )
            },
            {
                "type": "section",
                "id": "pricing",
                "heading": "Step 1: Benchmark and Price Your Rent Realistically",
                "body": (
                    "<p>Tenants today compare 10 to 15 listings simultaneously across rental portals before booking visits. To get your phone ringing immediately:</p>"
                    "<ul>"
                    "<li><strong>Analyze exact recent closures:</strong> Do not benchmark against wishful asking prices on classified portals. Check what flats in your exact tower or society actually closed for over the past 30 days.</li>"
                    "<li><strong>Clarify maintenance upfront:</strong> Clearly state whether society maintenance is included or extra. Renters appreciate complete transparency over surprise bills at agreement signing.</li>"
                    "<li><strong>Value-add furnishing:</strong> Installing modern modular kitchen woodwork, exhaust fans, curtain rods, and LED lights costs under ₹25,000 but allows you to charge ₹1,500–₹2,500 more per month and cuts vacancy by half.</li>"
                    "</ul>"
                )
            },
            {
                "type": "section",
                "id": "photos",
                "heading": "Step 2: Take High-Converting Photos & Video Walkthrough",
                "body": (
                    "<p>Over 90% of tenant inquiries are determined by the first three photos of your listing:</p>"
                    "<ol>"
                    "<li><strong>Daylight Photos Only:</strong> Turn on all lights, open all balcony curtains, and shoot wide-angle photos during morning natural sunlight.</li>"
                    "<li><strong>Show Bathrooms & Kitchen:</strong> Renters examine clean sanitary fittings, kitchen countertops, and woodwork closely. A clean kitchen photo doubles inquiry rates.</li>"
                    "<li><strong>Record a 60-Second Video Walkthrough:</strong> Start at the entrance door, walk through the living hall, show the balcony view, and enter the master bedroom. Video tours eliminate non-serious inquiries and save you hours of physical visits.</li>"
                    "</ol>"
                )
            },
            {
                "type": "section",
                "id": "screening",
                "heading": "Step 3: Screen Tenants for Financial & Background Stability",
                "body": (
                    "<p>A prompt-paying, clean tenant is worth far more than a slightly higher paying tenant who causes disputes. Always collect and verify:</p>"
                    "<ul>"
                    "<li><strong>Corporate Email & Salary Proof:</strong> Verify corporate email address or 3 months' salary credit slips for salaried professionals.</li>"
                    "<li><strong>Aadhaar & Permanent Address Check:</strong> Always verify identity against the original physical document.</li>"
                    "<li><strong>Mandatory UP Cop Police Verification:</strong> Ensure online police verification is submitted before keys are handed over.</li>"
                    "</ul>"
                )
            },
            {
                "type": "section",
                "id": "agreement",
                "heading": "Step 4: Draft an Enforceable 11-Month Rental Agreement",
                "body": (
                    "<p>Never use generic stationery shop templates. Ensure your agreement explicitly specifies:</p>"
                    "<ul>"
                    "<li><strong>1-Month or 2-Month Notice Period:</strong> Both parties must provide written 30-day notice prior to vacating.</li>"
                    "<li><strong>Lock-In Clause:</strong> A standard 3-month to 6-month lock-in period prevents tenant turnover right after moving in.</li>"
                    "<li><strong>Repairs & Painting Clause:</strong> Clear terms specifying that tenant is responsible for routine minor maintenance and flat repainting costs upon exit.</li>"
                    "</ul>"
                )
            },
            {
                "type": "section",
                "id": "owner-instamakaan",
                "heading": "Let InstaMakaan Manage Your Property End-to-End",
                "body": (
                    "<p>Don't want to attend endless phone calls, arrange weekend flat showings, and negotiate with brokers? <a href='https://instamakaan.com/partner'>List your property with InstaMakaan</a>.</p>"
                    "<p>We provide professional photography, verified tenant matching, legal lease drafting, and digital rent collection — all with complete transparency and zero brokerage hassle.</p>"
                )
            }
        ],
        "faqs": [
            {
                "q": "What is the standard security deposit for flats in Noida Extension?",
                "a": "The industry standard in Noida Extension and Greater Noida West is 1 to 2 months rent for semi-furnished flats, and 2 months rent for fully furnished units."
            },
            {
                "q": "Who pays the society move-in and move-out charges?",
                "a": "Most housing societies in Noida Extension charge a one-time move-in and move-out fee (typically ₹1,000 to ₹3,000). By standard NCR market convention, the tenant pays this fee directly to the society facility office."
            },
            {
                "q": "How can an NRI or outstation landlord manage rental flats in Noida?",
                "a": "InstaMakaan offers full NRI and outstation property management, handling key custody, tenant inspection, rent agreements, regular quarterly inspections, and digital rent remittance directly to your bank account."
            },
            {
                "q": "Can I legally increase rent every year in Uttar Pradesh?",
                "a": "Yes. Most 11-month lease deeds include a standard annual escalation clause of 5% to 10% upon mutual agreement and lease renewal."
            }
        ],
        "status": "published"
    }
]


async def seed():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    collection = db["blogs"]

    for post in SEO_BLOGS:
        slug = post["slug"]
        existing = await collection.find_one({"slug": slug})
        now = datetime.now(timezone.utc)
        post["created_at"] = now
        post["updated_at"] = now
        post.setdefault("views", 120)

        if existing:
            # Update content and SEO fields
            await collection.update_one({"slug": slug}, {"$set": post})
            print(f"[UPDATED] SEO Blog: {post['title']}")
        else:
            await collection.insert_one(post)
            print(f"[CREATED] SEO Blog: {post['title']}")

    total = await collection.count_documents({"status": "published"})
    print(f"\n[SUCCESS] Total published blogs in database: {total}")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed())
