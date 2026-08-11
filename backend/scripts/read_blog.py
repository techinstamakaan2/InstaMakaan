import sys, os, asyncio, re
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parent.parent / ".env")
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME   = os.environ.get("DB_NAME", "instamakaan")

SLUGS = [
    "best-area-to-rent-in-noida-extension-2026",
    "documents-checklist-renting-flat-noida-extension",
    "noida-extension-vs-siddharth-vihar-which-is-better-to-rent-in-for-2026",
    "moving-noida-new-job-neighbourhood-guide",
    "tenant-rights-india-what-every-renter-must-know",
    "how-to-break-rent-agreement-early-noida",
]

async def main():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    results = []
    for slug in SLUGS:
        blog = await db.blogs.find_one({"slug": slug})
        results.append({
            "slug": slug,
            "meta": blog.get("meta_description", ""),
            "faqs": len(blog.get("faqs", [])),
        })
    client.close()

    import json
    print(json.dumps(results, ensure_ascii=False))

asyncio.run(main())
