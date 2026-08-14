"""
InstaMakaan - Production Database Seed Script
Creates all 14 collections with proper sample data for a brand new MongoDB database.

Usage:
    cd backend
    .\\venv\\Scripts\\activate
    set PYTHONIOENCODING=utf-8
    python seed_production.py
"""

import asyncio
import os
import sys
from motor.motor_asyncio import AsyncIOMotorClient
from uuid import uuid4
from datetime import datetime, timezone, timedelta

# Try to use bcrypt directly instead of passlib (avoids version conflicts)
try:
    import bcrypt
    def get_password_hash(password: str) -> str:
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
except ImportError:
    # Fallback: use passlib
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)


def now_iso():
    return datetime.now(timezone.utc).isoformat()


async def seed_database(mongo_url: str, db_name: str = "instamakaan"):
    print(f"\nConnecting to MongoDB...")
    print(f"Database: {db_name}\n")

    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]

    # Check connection
    try:
        await client.admin.command('ping')
        print("MongoDB connection successful!\n")
    except Exception as e:
        print(f"MongoDB connection failed: {e}")
        print("\nPlease check:")
        print("  1. Your connection string is correct")
        print("  2. Your password is correct (special chars must be URL-encoded)")
        print("  3. Network Access is set to 0.0.0.0/0 in MongoDB Atlas")
        return

    # Clear existing data
    print("Clearing existing data...")
    collections_to_clear = [
        "properties", "owners", "agents", "inquiries", "users",
        "visits", "blogs", "blog_comments", "faq_categories",
        "instagram_posts", "cms", "audit_logs", "media", "otp_store"
    ]
    for coll in collections_to_clear:
        await db[coll].delete_many({})
    print("   Done!\n")

    # ──────────────────────────────────────────────
    # 1. OWNERS
    # ──────────────────────────────────────────────
    print("Creating owners...")
    owners = [
        {
            "id": str(uuid4()),
            "name": "Rajesh Kumar",
            "email": "rajesh@example.com",
            "phone": "+91 98765 43210",
            "address": "Sector 150, Noida",
            "status": "active",
            "created_at": now_iso(),
            "updated_at": now_iso()
        },
        {
            "id": str(uuid4()),
            "name": "Priya Sharma",
            "email": "priya@example.com",
            "phone": "+91 87654 32109",
            "address": "Greater Noida West",
            "status": "active",
            "created_at": now_iso(),
            "updated_at": now_iso()
        },
        {
            "id": str(uuid4()),
            "name": "Vikram Malhotra",
            "email": "vikram@example.com",
            "phone": "+91 76543 21098",
            "address": "Sector 128, Noida",
            "status": "active",
            "created_at": now_iso(),
            "updated_at": now_iso()
        }
    ]
    await db.owners.insert_many(owners)
    print(f"   Created {len(owners)} owners")

    # ──────────────────────────────────────────────
    # 2. AGENTS
    # ──────────────────────────────────────────────
    print("Creating agents...")
    agents = [
        {
            "id": str(uuid4()),
            "name": "Amit Singh",
            "email": "amit@instamakaan.com",
            "phone": "+91 99999 88888",
            "designation": "Senior Field Agent",
            "status": "active",
            "total_inquiries_handled": 12,
            "created_at": now_iso(),
            "updated_at": now_iso()
        },
        {
            "id": str(uuid4()),
            "name": "Neha Gupta",
            "email": "neha@instamakaan.com",
            "phone": "+91 88888 77777",
            "designation": "Property Consultant",
            "status": "active",
            "total_inquiries_handled": 8,
            "created_at": now_iso(),
            "updated_at": now_iso()
        },
        {
            "id": str(uuid4()),
            "name": "Rohit Verma",
            "email": "rohit@instamakaan.com",
            "phone": "+91 77777 66666",
            "designation": "Junior Agent",
            "status": "active",
            "total_inquiries_handled": 3,
            "created_at": now_iso(),
            "updated_at": now_iso()
        }
    ]
    await db.agents.insert_many(agents)
    print(f"   Created {len(agents)} agents")

    # ──────────────────────────────────────────────
    # 3. PROPERTIES
    # ──────────────────────────────────────────────
    print("Creating properties...")
    properties = [
        {
            "id": str(uuid4()),
            "title": "3 BHK Luxury Apartment in ATS Greens",
            "description": "Beautiful 3 BHK apartment with modern amenities, spacious rooms, and great ventilation. Located in a prime location with easy access to metro, schools, and hospitals.",
            "property_type": "rent",
            "status": "active",
            "location": "Sector 150, Noida",
            "sector": "Sector 150",
            "city": "Noida",
            "locality": "Sector 150",
            "price": "45,000",
            "price_label": "Full Flat Rent",
            "monthly_rent_amount": 45000,
            "beds": 3,
            "baths": 3,
            "area": "1800 sq.ft",
            "furnishing": "semi-furnished",
            "preferred_tenant": "family",
            "deposit": "2 Months",
            "brokerage": "15 Days",
            "images": [
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
            ],
            "features": ["Modular Kitchen", "Power Backup", "Parking", "Balcony"],
            "amenities": ["Swimming Pool", "Gym", "Club House", "24x7 Security"],
            "owner_id": owners[0]["id"],
            "owner_name": owners[0]["name"],
            "is_managed": False,
            "is_parent": False,
            "created_at": now_iso(),
            "updated_at": now_iso()
        },
        {
            "id": str(uuid4()),
            "title": "4 BHK Villa in Jaypee Greens",
            "description": "Stunning 4 BHK villa with private garden, modern interiors, and premium fittings. Perfect for families looking for luxury living with ample space and privacy.",
            "property_type": "buy",
            "status": "active",
            "location": "Sector 128, Noida",
            "sector": "Sector 128",
            "city": "Noida",
            "locality": "Sector 128",
            "price": "2.5 Cr",
            "price_label": "Price",
            "beds": 4,
            "baths": 4,
            "area": "3500 sq.ft",
            "furnishing": "unfurnished",
            "images": [
                "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
            ],
            "features": ["Private Garden", "Servant Quarter", "Study Room", "Home Theatre"],
            "amenities": ["24x7 Security", "CCTV", "Kids Play Area", "Jogging Track"],
            "owner_id": owners[1]["id"],
            "owner_name": owners[1]["name"],
            "is_managed": False,
            "is_parent": False,
            "created_at": now_iso(),
            "updated_at": now_iso()
        },
        {
            "id": str(uuid4()),
            "title": "2 BHK Flat in Gaur City",
            "description": "Well-maintained 2 BHK flat perfect for small families or working professionals. Close to metro station and major IT hubs.",
            "property_type": "rent",
            "status": "active",
            "location": "Greater Noida West",
            "sector": "Gaur City",
            "city": "Greater Noida",
            "locality": "Greater Noida West",
            "price": "18,000",
            "price_label": "Per Bed Rent",
            "monthly_rent_amount": 18000,
            "beds": 2,
            "baths": 2,
            "area": "1200 sq.ft",
            "furnishing": "furnished",
            "preferred_tenant": "any",
            "deposit": "1 Month",
            "brokerage": "10 Days",
            "images": [
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
            ],
            "features": ["Balcony", "Store Room", "Covered Parking"],
            "amenities": ["Metro Nearby", "Shopping Mall", "Hospital", "Schools"],
            "owner_id": owners[0]["id"],
            "owner_name": owners[0]["name"],
            "is_managed": False,
            "is_parent": False,
            "created_at": now_iso(),
            "updated_at": now_iso()
        },
        {
            "id": str(uuid4()),
            "title": "Pre-Occupied Managed Home in Supertech",
            "description": "Professionally managed pre-occupied property generating steady rental income. Ideal for investors looking for hassle-free returns.",
            "property_type": "pre-occupied",
            "status": "active",
            "location": "Greater Noida West",
            "sector": "Supertech Eco Village",
            "city": "Greater Noida",
            "locality": "Greater Noida West",
            "price": "78,968",
            "price_label": "Total Price",
            "monthly_rent_amount": 15000,
            "beds": 2,
            "baths": 2,
            "area": "1100 sq.ft",
            "furnishing": "semi-furnished",
            "images": [
                "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"
            ],
            "features": ["Rental Income", "Managed Property", "Regular Maintenance"],
            "amenities": ["Security", "Power Backup", "Water Supply"],
            "owner_id": owners[2]["id"],
            "owner_name": owners[2]["name"],
            "is_managed": True,
            "is_parent": True,
            "created_at": now_iso(),
            "updated_at": now_iso()
        },
        {
            "id": str(uuid4()),
            "title": "Studio Apartment in Noida Extension",
            "description": "Compact and cozy studio apartment perfect for bachelors or young professionals. Fully furnished with all modern amenities.",
            "property_type": "rent",
            "status": "active",
            "location": "Noida Extension",
            "sector": "Sector 1",
            "city": "Noida",
            "locality": "Noida Extension",
            "price": "12,000",
            "price_label": "Full Flat Rent",
            "monthly_rent_amount": 12000,
            "beds": 1,
            "baths": 1,
            "area": "450 sq.ft",
            "furnishing": "furnished",
            "preferred_tenant": "bachelor",
            "deposit": "1 Month",
            "brokerage": "7 Days",
            "images": [
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
            ],
            "features": ["Fully Furnished", "AC", "WiFi Ready"],
            "amenities": ["Laundry", "House Keeping Available"],
            "owner_id": owners[1]["id"],
            "owner_name": owners[1]["name"],
            "is_managed": False,
            "is_parent": False,
            "created_at": now_iso(),
            "updated_at": now_iso()
        }
    ]
    await db.properties.insert_many(properties)
    print(f"   Created {len(properties)} properties")

    # ──────────────────────────────────────────────
    # 4. INQUIRIES
    # ──────────────────────────────────────────────
    print("Creating inquiries...")
    inquiries = [
        {
            "id": str(uuid4()),
            "name": "Rahul Verma",
            "email": "rahul.verma@email.com",
            "phone": "+91 77777 66666",
            "message": "Interested in the 3 BHK apartment in ATS Greens. Please arrange a site visit this weekend.",
            "inquiry_type": "schedule_visit",
            "property_id": properties[0]["id"],
            "listing_id": properties[0]["id"],
            "status": "ASSIGNED",
            "stage": "ASSIGNED",
            "assigned_agent_id": agents[0]["id"],
            "assigned_agent_name": agents[0]["name"],
            "whatsapp_opt_in": True,
            "conversation_logs": [
                {
                    "agent_id": agents[0]["id"],
                    "agent_name": agents[0]["name"],
                    "message": "Inquiry received and assigned",
                    "timestamp": now_iso(),
                    "status_change": "assigned"
                }
            ],
            "notes": [],
            "created_at": now_iso(),
            "updated_at": now_iso()
        },
        {
            "id": str(uuid4()),
            "name": "Sneha Kapoor",
            "email": "sneha.k@email.com",
            "phone": "+91 66666 55555",
            "message": "Looking for 4 BHK villa in Jaypee Greens. What is the best price?",
            "inquiry_type": "price_inquiry",
            "property_id": properties[1]["id"],
            "listing_id": properties[1]["id"],
            "status": "NEW",
            "stage": "NEW",
            "whatsapp_opt_in": False,
            "notes": [],
            "created_at": now_iso(),
            "updated_at": now_iso()
        },
        {
            "id": str(uuid4()),
            "name": "Arjun Mehta",
            "email": "arjun.m@email.com",
            "phone": "+91 55555 44444",
            "message": "Need a 2 BHK for my family. We are relocating from Delhi next month.",
            "inquiry_type": "TENANT",
            "status": "ASSIGNED",
            "stage": "ASSIGNED",
            "assigned_agent_id": agents[1]["id"],
            "assigned_agent_name": agents[1]["name"],
            "whatsapp_opt_in": True,
            "conversation_logs": [
                {
                    "agent_id": agents[1]["id"],
                    "agent_name": agents[1]["name"],
                    "message": "Called the customer. Discussed requirements - needs 2 BHK with parking, budget 15-20k.",
                    "timestamp": now_iso(),
                    "status_change": "talked"
                }
            ],
            "notes": [{"text": "Customer prefers Gaur City area", "author": "Neha Gupta", "timestamp": now_iso()}],
            "created_at": now_iso(),
            "updated_at": now_iso()
        },
        {
            "id": str(uuid4()),
            "name": "Kavita Joshi",
            "email": "kavita.j@email.com",
            "phone": "+91 44444 33333",
            "message": "Want to invest in pre-occupied property. Looking for good returns.",
            "inquiry_type": "investment",
            "property_id": properties[3]["id"],
            "listing_id": properties[3]["id"],
            "status": "NEW",
            "stage": "NEW",
            "whatsapp_opt_in": False,
            "notes": [],
            "created_at": now_iso(),
            "updated_at": now_iso()
        }
    ]
    await db.inquiries.insert_many(inquiries)
    print(f"   Created {len(inquiries)} inquiries")

    # ──────────────────────────────────────────────
    # 5. USERS (Admin, Owner, Agent, User accounts)
    # ──────────────────────────────────────────────
    print("Creating users...")
    users = [
        # Admin
        {
            "id": "admin-1",
            "name": "Admin User",
            "email": "admin@instamakaan.com",
            "password": get_password_hash("Admin1234Makaan"),
            "password_hash": get_password_hash("Admin1234Makaan"),
            "role": "ADMIN",
            "status": "active",
            "email_verified": True,
            "referral_code": "ADMIN001",
            "wallet_balance": 0,
            "saved_properties": [],
            "created_at": now_iso(),
            "updated_at": now_iso()
        },
        # Owner 1
        {
            "id": str(uuid4()),
            "name": owners[0]["name"],
            "email": owners[0]["email"],
            "password": get_password_hash("owner123"),
            "password_hash": get_password_hash("owner123"),
            "role": "OWNER",
            "status": "active",
            "email_verified": True,
            "linked_id": owners[0]["id"],
            "referral_code": "OWNER001",
            "wallet_balance": 0,
            "saved_properties": [],
            "created_at": now_iso(),
            "updated_at": now_iso()
        },
        # Owner 2
        {
            "id": str(uuid4()),
            "name": owners[1]["name"],
            "email": owners[1]["email"],
            "password": get_password_hash("owner123"),
            "password_hash": get_password_hash("owner123"),
            "role": "OWNER",
            "status": "active",
            "email_verified": True,
            "linked_id": owners[1]["id"],
            "referral_code": "OWNER002",
            "wallet_balance": 0,
            "saved_properties": [],
            "created_at": now_iso(),
            "updated_at": now_iso()
        },
        # Agent 1
        {
            "id": str(uuid4()),
            "name": agents[0]["name"],
            "email": agents[0]["email"],
            "password": get_password_hash("agent123"),
            "password_hash": get_password_hash("agent123"),
            "role": "AGENT",
            "status": "active",
            "email_verified": True,
            "linked_id": agents[0]["id"],
            "referral_code": "AGENT001",
            "wallet_balance": 0,
            "saved_properties": [],
            "created_at": now_iso(),
            "updated_at": now_iso()
        },
        # Agent 2
        {
            "id": str(uuid4()),
            "name": agents[1]["name"],
            "email": agents[1]["email"],
            "password": get_password_hash("agent123"),
            "password_hash": get_password_hash("agent123"),
            "role": "AGENT",
            "status": "active",
            "email_verified": True,
            "linked_id": agents[1]["id"],
            "referral_code": "AGENT002",
            "wallet_balance": 0,
            "saved_properties": [],
            "created_at": now_iso(),
            "updated_at": now_iso()
        },
        # Test User
        {
            "id": str(uuid4()),
            "name": "Test User",
            "email": "testuser@example.com",
            "password": get_password_hash("user123"),
            "password_hash": get_password_hash("user123"),
            "role": "USER",
            "status": "active",
            "email_verified": True,
            "referral_code": "USER0001",
            "wallet_balance": 0,
            "saved_properties": [properties[0]["id"], properties[2]["id"]],
            "created_at": now_iso(),
            "updated_at": now_iso()
        }
    ]
    await db.users.insert_many(users)
    # Create unique index on email
    await db.users.create_index("email", unique=True)
    print(f"   Created {len(users)} users (with unique email index)")

    # ──────────────────────────────────────────────
    # 6. FAQ CATEGORIES
    # ──────────────────────────────────────────────
    print("Creating FAQ categories...")
    faq_categories = [
        {
            "name": "Renting a Property",
            "slug": "renting",
            "description": "Common questions about renting properties through InstaMakaan",
            "icon": "home",
            "order": 1,
            "status": "published",
            "faqs": [
                {"id": str(uuid4()), "question": "How do I schedule a property visit?", "answer": "You can schedule a visit by clicking the 'Schedule Visit' button on any property listing. Our team will confirm the visit within 24 hours.", "order": 1},
                {"id": str(uuid4()), "question": "What documents do I need for renting?", "answer": "You typically need a valid ID proof (Aadhaar/PAN), address proof, income proof (salary slips or ITR), and passport-size photographs.", "order": 2},
                {"id": str(uuid4()), "question": "How much is the security deposit?", "answer": "Security deposit varies by property and owner. It is usually 1-3 months' rent. The exact amount is mentioned on each property listing.", "order": 3},
                {"id": str(uuid4()), "question": "What is the brokerage fee?", "answer": "Brokerage typically ranges from 7 to 15 days of rent, depending on the property. This is clearly mentioned on the listing.", "order": 4}
            ],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "name": "Buying a Property",
            "slug": "buying",
            "description": "Questions about purchasing properties",
            "icon": "key",
            "order": 2,
            "status": "published",
            "faqs": [
                {"id": str(uuid4()), "question": "Does InstaMakaan help with home loans?", "answer": "While we don't directly provide loans, we can connect you with trusted banking partners who offer competitive home loan rates.", "order": 1},
                {"id": str(uuid4()), "question": "Are the listed prices negotiable?", "answer": "Prices listed are indicative. Our agents can help you negotiate the best deal with the property owner.", "order": 2},
                {"id": str(uuid4()), "question": "What is a pre-occupied property?", "answer": "A pre-occupied property is one that already has tenants. It is ideal for investors looking for immediate rental income without the hassle of finding tenants.", "order": 3}
            ],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "name": "About InstaMakaan",
            "slug": "about",
            "description": "General questions about our platform and services",
            "icon": "info",
            "order": 3,
            "status": "published",
            "faqs": [
                {"id": str(uuid4()), "question": "What areas does InstaMakaan cover?", "answer": "We currently operate in Noida, Greater Noida, and Greater Noida West (Noida Extension). We are rapidly expanding to cover more areas.", "order": 1},
                {"id": str(uuid4()), "question": "How can I list my property on InstaMakaan?", "answer": "You can list your property by contacting us through WhatsApp or by filling out the inquiry form. Our team will guide you through the process.", "order": 2},
                {"id": str(uuid4()), "question": "Is InstaMakaan free for tenants?", "answer": "Browsing and inquiring about properties is completely free. A brokerage fee is charged only when you finalize a property.", "order": 3}
            ],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
    ]
    await db.faq_categories.insert_many(faq_categories)
    print(f"   Created {len(faq_categories)} FAQ categories")

    # ──────────────────────────────────────────────
    # 7. INSTAGRAM POSTS
    # ──────────────────────────────────────────────
    print("Creating Instagram posts...")
    instagram_posts = [
        {
            "id": str(uuid4()),
            "embed_url": "https://www.instagram.com/reel/instamakaan1/",
            "has_video": True,
            "order": 1,
            "is_active": True,
            "created_at": now_iso(),
            "updated_at": now_iso()
        },
        {
            "id": str(uuid4()),
            "embed_url": "https://www.instagram.com/reel/instamakaan2/",
            "has_video": True,
            "order": 2,
            "is_active": True,
            "created_at": now_iso(),
            "updated_at": now_iso()
        },
        {
            "id": str(uuid4()),
            "embed_url": "https://www.instagram.com/p/instamakaan3/",
            "has_video": False,
            "order": 3,
            "is_active": True,
            "created_at": now_iso(),
            "updated_at": now_iso()
        }
    ]
    await db.instagram_posts.insert_many(instagram_posts)
    print(f"   Created {len(instagram_posts)} Instagram posts")

    # ──────────────────────────────────────────────
    # 8. BLOGS
    # ──────────────────────────────────────────────
    print("Creating blog posts...")
    blogs = [
        {
            "title": "Top 5 Sectors to Rent in Noida in 2026",
            "slug": "top-5-sectors-rent-noida-2026",
            "excerpt": "Discover the best sectors in Noida for renting apartments with great connectivity and amenities.",
            "category": "Real Estate",
            "date": "2026-08-01",
            "readTime": "5 min read",
            "image": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
            "heroImage": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
            "author": {"name": "InstaMakaan Team", "role": "Real Estate Experts"},
            "blocks": [
                {"type": "section", "heading": "Introduction", "body": "Noida has emerged as one of the most sought-after residential destinations in the NCR region. With excellent infrastructure, metro connectivity, and world-class amenities, finding the right sector to rent in can make all the difference."},
                {"type": "section", "heading": "1. Sector 150 - The Green Paradise", "body": "Sector 150 is known for its lush green surroundings and premium housing societies like ATS Greens, Ace Parkway, and Jaypee Greens. Rent ranges from Rs 15,000 to Rs 50,000 depending on the size and furnishing."},
                {"type": "section", "heading": "2. Sector 128 - Premium Living", "body": "One of the most premium sectors in Noida, Sector 128 offers villa communities and high-rise apartments with excellent security and amenities."},
                {"type": "section", "heading": "3. Gaur City - Budget-Friendly", "body": "Gaur City in Greater Noida West is perfect for those looking for affordable rentals with good connectivity to Noida and Delhi."},
                {"type": "section", "heading": "4. Sector 75 - Metro Connected", "body": "With direct metro connectivity, Sector 75 is ideal for working professionals who commute to Delhi or other parts of Noida."},
                {"type": "section", "heading": "5. Noida Extension - Emerging Hub", "body": "Noida Extension offers the best value for money with new constructions and modern amenities at competitive prices."}
            ],
            "faqs": [
                {"q": "What is the average rent in Noida?", "a": "Average rent in Noida ranges from Rs 10,000 for a 1 BHK to Rs 50,000+ for a 4 BHK, depending on the sector and amenities."},
                {"q": "Is Noida safe for families?", "a": "Yes, Noida is considered very safe, especially gated societies which have 24x7 security, CCTV surveillance, and restricted access."}
            ],
            "tags": ["noida", "rental", "real-estate", "sectors"],
            "status": "published",
            "views": 245,
            "order": 1,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "title": "A Complete Guide to Investing in Pre-Occupied Properties",
            "slug": "guide-investing-pre-occupied-properties",
            "excerpt": "Learn how pre-occupied properties can generate steady passive income with minimal effort.",
            "category": "Investment",
            "date": "2026-07-15",
            "readTime": "7 min read",
            "image": "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
            "heroImage": "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200",
            "author": {"name": "InstaMakaan Team", "role": "Investment Advisors"},
            "blocks": [
                {"type": "section", "heading": "What are Pre-Occupied Properties?", "body": "Pre-occupied properties are residential units that already have tenants living in them. When you buy such a property, you immediately start earning rental income from day one."},
                {"type": "section", "heading": "Benefits of Pre-Occupied Investment", "body": "The biggest advantage is guaranteed rental income from the moment you purchase. There is no waiting period to find tenants, and the property is already maintained and livable."},
                {"type": "section", "heading": "How InstaMakaan Helps", "body": "We manage the entire process - from finding the right property to handling tenant relations, maintenance, and rent collection. You just sit back and earn."}
            ],
            "faqs": [
                {"q": "What returns can I expect?", "a": "Pre-occupied properties typically offer 6-10% annual returns through rental income."},
                {"q": "Who manages the tenants?", "a": "InstaMakaan provides complete property management services including tenant management, maintenance, and rent collection."}
            ],
            "tags": ["investment", "pre-occupied", "passive-income"],
            "status": "published",
            "views": 182,
            "order": 2,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
    ]
    await db.blogs.insert_many(blogs)
    print(f"   Created {len(blogs)} blog posts")

    # ──────────────────────────────────────────────
    # 9. CMS (Homepage content)
    # ──────────────────────────────────────────────
    print("Creating CMS content...")
    cms_content = {
        "page": "home",
        "content": {
            "hero": {
                "title": "Find Your Perfect Home in Noida",
                "subtitle": "Discover rental properties, buy your dream home, or invest in pre-occupied managed properties.",
                "cta_text": "Browse Properties",
                "cta_link": "/properties"
            },
            "stats": {
                "properties_listed": "500+",
                "happy_tenants": "1000+",
                "sectors_covered": "25+",
                "years_experience": "5+"
            },
            "about": {
                "title": "Why InstaMakaan?",
                "description": "We are Noida's most trusted real estate platform, connecting tenants with verified properties and landlords with reliable tenants."
            }
        }
    }
    await db.cms.insert_one(cms_content)
    print("   Created homepage CMS content")

    # ──────────────────────────────────────────────
    # 10. Create empty collections (so they exist)
    # ──────────────────────────────────────────────
    print("Creating empty collections...")
    for coll_name in ["visits", "blog_comments", "audit_logs", "media", "otp_store"]:
        # Insert and delete a dummy doc to ensure the collection exists
        await db[coll_name].insert_one({"_init": True})
        await db[coll_name].delete_one({"_init": True})
    print("   Created: visits, blog_comments, audit_logs, media, otp_store")

    # ──────────────────────────────────────────────
    # SUMMARY
    # ──────────────────────────────────────────────
    print("\n" + "=" * 55)
    print("  DATABASE SEEDED SUCCESSFULLY!")
    print("=" * 55)
    print(f"\nSummary:")
    print(f"   Owners:          {len(owners)}")
    print(f"   Agents:          {len(agents)}")
    print(f"   Properties:      {len(properties)}")
    print(f"   Inquiries:       {len(inquiries)}")
    print(f"   Users:           {len(users)}")
    print(f"   FAQ Categories:  {len(faq_categories)}")
    print(f"   Instagram Posts: {len(instagram_posts)}")
    print(f"   Blog Posts:      {len(blogs)}")
    print(f"   CMS Pages:       1")
    print(f"\nLogin Credentials:")
    print(f"   Admin  | admin@instamakaan.com    | Admin1234Makaan")
    print(f"   Owner  | rajesh@example.com       | owner123")
    print(f"   Owner  | priya@example.com        | owner123")
    print(f"   Agent  | amit@instamakaan.com     | agent123")
    print(f"   Agent  | neha@instamakaan.com     | agent123")
    print(f"   User   | testuser@example.com     | user123")
    print()

    client.close()


if __name__ == "__main__":
    print("\n=== InstaMakaan Production Database Seeder ===\n")

    # Check if MONGO_URL is in environment or .env
    from dotenv import load_dotenv
    load_dotenv()

    mongo_url = os.getenv("MONGO_URL")

    if not mongo_url or "--new" in sys.argv:
        print("Paste your NEW MongoDB connection string below.")
        print("(It should look like: mongodb+srv://username:password@cluster.xxxxx.mongodb.net/...)")
        print()
        mongo_url = input("Connection String: ").strip()
        if not mongo_url:
            print("No connection string provided. Exiting.")
            sys.exit(1)

    db_name = os.getenv("DB_NAME", "instamakaan")

    asyncio.run(seed_database(mongo_url, db_name))
