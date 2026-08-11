"""
Run this script once with the backend running:
  python scripts/create_blog_documents_checklist.py
"""
import requests, json

API = "http://127.0.0.1:8000/api/blogs/"

blog = {
    "title": "Renting a Flat in Noida Extension: The Complete Documents Checklist for Tenants & Owners",
    "slug": "documents-checklist-renting-flat-noida-extension",
    "excerpt": "Before you sign a rent agreement in Noida Extension or anywhere in NCR, make sure you have every document in order. This checklist covers what tenants need, what owners must provide, and what to verify before handing over the keys.",
    "category": "Renting Guide",
    "date": "2026-06-09",
    "readTime": "7 min read",
    "heroImage": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?fm=jpg&q=80&w=1400&auto=format&fit=crop",
    "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?fm=jpg&q=80&w=800&auto=format&fit=crop",
    "author": {
        "name": "InstaMakaan Team",
        "role": "Property Experts, Noida NCR"
    },
    "tags": ["renting", "documents", "noida extension", "rent agreement", "checklist", "tenants", "owners"],
    "toc": [
        "Why Documents Matter Before You Rent",
        "Documents Tenants Must Provide",
        "Documents Owners Must Provide",
        "What to Check in the Rent Agreement",
        "Police Verification: Is It Mandatory?",
        "Security Deposit: How Much & What's Normal",
        "Red Flags to Watch Out For",
        "FAQ"
    ],
    "keyStats": [
        {"label": "Avg Security Deposit", "value": "2 Months Rent", "icon": "💰"},
        {"label": "Notice Period (Typical)", "value": "1 Month", "icon": "📅"},
        {"label": "Stamp Duty (UP)", "value": "₹100–500", "icon": "📜"},
        {"label": "Police Verification", "value": "Mandatory in Noida", "icon": "🛡️"}
    ],
    "blocks": [
        {
            "type": "section",
            "id": "intro",
            "heading": "Why Documents Matter Before You Rent",
            "body": "<p>Renting a flat in Noida Extension, Greater Noida West, or anywhere in NCR is exciting — but skipping the paperwork is one of the most common and costly mistakes tenants and owners both make.</p><p>For <strong>tenants</strong>, missing documents can mean losing the flat to another applicant, or worse, finding yourself in a dispute with no proof of your rights. For <strong>owners</strong>, not collecting proper tenant documents is a legal and safety risk.</p><p>This checklist covers every document you need — whether you are the tenant moving in or the owner handing over the keys.</p>"
        },
        {
            "type": "section",
            "id": "tenant-docs",
            "heading": "Documents Tenants Must Provide",
            "body": "<p>When you apply for a rental flat, the owner or property manager will ask for the following. Keep both originals and photocopies ready.</p><h3>Identity Proof (any one)</h3><ul><li>Aadhaar Card <em>(most widely accepted)</em></li><li>Passport</li><li>Voter ID Card</li><li>Driving Licence</li></ul><h3>Address Proof (any one)</h3><ul><li>Aadhaar Card (if it has your current or permanent address)</li><li>Passport</li><li>Utility bill from your previous residence (electricity, gas, water)</li><li>Bank passbook with address</li></ul><h3>Employment / Income Proof</h3><ul><li><strong>Salaried:</strong> Last 3 months salary slips + offer letter or employee ID</li><li><strong>Self-employed / Business:</strong> GST certificate or ITR (last 1–2 years)</li><li><strong>Student:</strong> College ID + parents' income proof or guarantor letter</li></ul><h3>Photographs</h3><ul><li>2–4 recent passport-size photographs</li></ul><h3>Emergency Contact</h3><ul><li>Name and phone number of a family member or local contact</li></ul><p><strong>Tip:</strong> Some owners in premium societies also ask for a <em>No Objection Certificate (NOC)</em> from your current employer confirming your employment. Keep one ready if you're moving for a job.</p>"
        },
        {
            "type": "section",
            "id": "owner-docs",
            "heading": "Documents Owners Must Provide",
            "body": "<p>Tenants have every right to ask for these documents before signing the rent agreement. A genuine owner will have no hesitation sharing them.</p><h3>Proof of Ownership</h3><ul><li><strong>Sale deed / Allotment letter</strong> — shows the owner legally owns the flat</li><li><strong>Registry document</strong> — registered with the sub-registrar's office</li><li><strong>Property tax receipts</strong> — recent, showing no dues</li></ul><h3>Society / Builder NOC (if applicable)</h3><ul><li>Some housing societies require the owner to take an NOC before renting out the flat. Ask if this is needed.</li></ul><h3>Encumbrance Certificate</h3><ul><li>Confirms the property has no pending loans or legal disputes against it. Not always demanded, but good to check for long leases.</li></ul><h3>Utility Bills</h3><ul><li>Last electricity bill and maintenance bill — confirms name on account and that no dues are pending</li></ul><h3>Owner's ID Proof</h3><ul><li>Aadhaar or PAN card of the owner (verify the name matches the property documents)</li></ul><p><strong>Important:</strong> If you are dealing with a <em>broker or property manager</em> instead of the owner directly, ask for an authorization letter from the owner confirming they can rent on their behalf.</p>"
        },
        {
            "type": "section",
            "id": "rent-agreement",
            "heading": "What to Check in the Rent Agreement",
            "body": "<p>The rent agreement (also called a lease deed) is the most important document in the entire process. In Uttar Pradesh (which covers Noida Extension and Greater Noida), a rent agreement for 11 months or less does not require registration but must be on stamp paper.</p><h3>Key clauses to verify before signing:</h3><ul><li><strong>Monthly rent amount</strong> — written clearly in both numbers and words</li><li><strong>Security deposit amount</strong> — and conditions for its return</li><li><strong>Rent escalation clause</strong> — what percentage increase is allowed and after how long (typically 5–10% per year)</li><li><strong>Lock-in period</strong> — minimum period you must stay before vacating without penalty</li><li><strong>Notice period</strong> — how many days' notice both parties must give before vacating or asking to vacate (usually 1 month)</li><li><strong>Maintenance charges</strong> — who pays society maintenance? Confirm it's written</li><li><strong>Utility bills</strong> — electricity, gas, water — confirm responsibility</li><li><strong>Pet and visitor policy</strong> — if relevant to you</li><li><strong>Painting and repair clause</strong> — who pays for painting at the end of tenancy</li></ul><h3>Stamp Paper Value (Uttar Pradesh)</h3><ul><li>For agreements up to 11 months: ₹100 stamp paper is standard</li><li>For agreements above 11 months: Registration is mandatory; stamp duty applies at a percentage of annual rent</li></ul><p>Both parties (owner and tenant) should sign every page of the agreement in the presence of two witnesses.</p>"
        },
        {
            "type": "section",
            "id": "police-verification",
            "heading": "Police Verification: Is It Mandatory?",
            "body": "<p>Yes — in Noida and Greater Noida, police verification of tenants is <strong>legally required</strong> under Uttar Pradesh rules. Owners who skip this can face penalties.</p><h3>How it works:</h3><ul><li>The owner submits the tenant's Aadhaar and address proof to the local police station (or via the UP Police online portal)</li><li>The process is usually completed within 7–15 days</li><li>As a tenant, cooperate fully — refusing is a red flag for owners</li></ul><p>At InstaMakaan, we handle police verification paperwork as part of our managed rental service, so neither owner nor tenant has to figure it out alone.</p>"
        },
        {
            "type": "section",
            "id": "security-deposit",
            "heading": "Security Deposit: How Much & What Is Normal in NCR?",
            "body": "<p>Security deposit norms vary by area in NCR:</p><ul><li><strong>Noida Extension / Greater Noida West:</strong> 1–2 months rent (most common)</li><li><strong>Noida (Sector 62, 137, 150):</strong> 2–3 months rent</li><li><strong>Indirapuram / Ghaziabad:</strong> 1–2 months rent</li></ul><p>The deposit should be returned within 15–30 days of vacating, after deducting any genuine damages (beyond normal wear and tear). Always get a receipt for the deposit payment — preferably via bank transfer so there is a record.</p><p><strong>Never pay the deposit in cash without a written receipt.</strong></p>"
        },
        {
            "type": "section",
            "id": "red-flags",
            "heading": "Red Flags to Watch Out For",
            "body": "<p>Knowing what to avoid is just as important as having the right documents.</p><ul><li>🚩 <strong>Owner refuses to show sale deed or property documents</strong> — never rent without proof of ownership</li><li>🚩 <strong>Broker charges more than 1 month rent as brokerage</strong> — this is above the typical market rate in NCR</li><li>🚩 <strong>No written agreement offered</strong> — verbal agreements have zero legal protection</li><li>🚩 <strong>Pressure to pay deposit or advance before agreement is signed</strong> — pay only after signing</li><li>🚩 <strong>Agreement drafted with only the owner's interests</strong> — exit clauses, repair responsibilities, and deposit return terms must be fair and mutual</li><li>🚩 <strong>Property is locked and the owner can't let you visit before paying advance</strong> — always inspect the flat first</li></ul>"
        },
        {
            "type": "section",
            "id": "instamakaan-note",
            "heading": "How InstaMakaan Makes This Easier",
            "body": "<p>Collecting, verifying, and organising all these documents can feel overwhelming — especially if you're moving to Noida from another city.</p><p>At <strong>InstaMakaan</strong>, our rental service handles the entire documentation process for you:</p><ul><li>✅ We verify the owner's property documents before listing any flat</li><li>✅ We draft a fair rent agreement — protecting both tenant and owner</li><li>✅ We coordinate police verification so neither party has to navigate it alone</li><li>✅ We maintain a digital record of all documents for both parties</li></ul><p>All our listed properties in Noida Extension, Greater Noida West, Sector 62, Sector 137, and surrounding areas come with verified owner documents — so you rent with complete confidence.</p>"
        }
    ],
    "faqs": [
        {
            "q": "Is a rent agreement compulsory for renting in Noida?",
            "a": "Yes. While a verbal agreement is technically valid, it offers no legal protection. A written rent agreement on stamp paper is strongly recommended and required by most housing societies and for police verification."
        },
        {
            "q": "Does the rent agreement need to be registered in UP?",
            "a": "Agreements of 11 months or less do not need to be registered in Uttar Pradesh — they only need to be on stamp paper (typically ₹100). Agreements for 12 months or more must be registered at the sub-registrar's office."
        },
        {
            "q": "What if the owner does not have all property documents?",
            "a": "Do not rent from that owner. An owner who cannot show a sale deed or allotment letter may not legally own the flat, or the property may have disputes. Always verify ownership before paying any amount."
        },
        {
            "q": "Can the owner increase rent before the agreement period ends?",
            "a": "No — rent can only be increased at the end of the agreement period, as per the rent escalation clause written in the agreement. Mid-tenancy increases without your written consent are not enforceable."
        },
        {
            "q": "How long does police verification take in Noida?",
            "a": "Typically 7–15 working days if submitted correctly. InstaMakaan handles this on your behalf as part of the rental process."
        },
        {
            "q": "Is it safe to pay the security deposit via cash?",
            "a": "It is always safer to pay via bank transfer (NEFT/UPI) and keep the payment record. If you must pay cash, get a signed receipt from the owner immediately."
        }
    ],
    "status": "published"
}

resp = requests.post(API, json=blog)
if resp.status_code == 201:
    data = resp.json()
    print(f"✅ Blog created successfully!")
    print(f"   ID   : {data.get('_id') or data.get('id')}")
    print(f"   Slug : {data.get('slug')}")
    print(f"   URL  : http://localhost:3000/blog/{data.get('slug')}")
else:
    print(f"❌ Failed: {resp.status_code}")
    print(resp.text)
