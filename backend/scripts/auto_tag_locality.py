"""
Auto-tags the `locality` field on properties by reading existing
`location`, `sector`, and `city` fields and matching against known localities.

Run with DRY_RUN=True first to preview, then set DRY_RUN=False to apply.
"""
import sys, os, asyncio, re
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parent.parent / ".env")
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME   = os.environ.get("DB_NAME", "instamakaan")

DRY_RUN = False  # ← Set to False to actually save changes

# Canonical locality names (same list as admin autocomplete)
LOCALITIES = [
    "Gaur City", "Techzone 4", "Noida Extension", "Greater Noida West",
    "Crossing Republik", "Nirala Estate", "Mahagun Mywoods", "Panchsheel Greens",
    "ATS Society", "Ace City", "Bisrakh", "Cherry County",
    "Sector 62 Noida", "Sector 75 Noida", "Sector 76 Noida", "Sector 78 Noida",
    "Sector 93 Noida", "Sector 100 Noida", "Sector 104 Noida", "Sector 107 Noida",
    "Sector 137 Noida", "Sector 143 Noida", "Sector 150 Noida", "Sector 168 Noida",
    "Sector 18 Noida", "Sector 44 Noida", "Sector 50 Noida",
    "Alpha Greater Noida", "Beta Greater Noida", "Chi Greater Noida",
    "Delta Greater Noida", "Ecotech Greater Noida", "Gamma Greater Noida",
    "Omega Greater Noida", "Phi Greater Noida", "Sigma Greater Noida",
    "Zeta Greater Noida", "Techzone Greater Noida",
    "Knowledge Park", "Pari Chowk", "Yamuna Expressway", "Jewar",
]

# Extra aliases → canonical name
ALIASES = {
    "noida ext":        "Noida Extension",
    "greater noida west": "Greater Noida West",
    "greater noida w":  "Greater Noida West",
    "gnw":              "Greater Noida West",
    "gaur":             "Gaur City",
    "gaur city 2":      "Gaur City",
    "gaur city 1":      "Gaur City",
    "tech zone 4":      "Techzone 4",
    "techzone4":        "Techzone 4",
    "techzone-4":       "Techzone 4",
    "o2 valley":        "Greater Noida West",
    "o2valley":         "Greater Noida West",
    "dream valley":     "Greater Noida West",
    "rg luxury":        "Greater Noida West",
    "aastha green":     "Greater Noida West",
    "astha green":      "Greater Noida West",
    "panchsheel green": "Panchsheel Greens",
    "crossing":         "Crossing Republik",
    "nirala":           "Nirala Estate",
    "mahagun":          "Mahagun Mywoods",
    "panchsheel":       "Panchsheel Greens",
    "ats":              "ATS Society",
    "ace":              "Ace City",
    "cherry":           "Cherry County",
    "sec 62":           "Sector 62 Noida",
    "sec 75":           "Sector 75 Noida",
    "sec 76":           "Sector 76 Noida",
    "sec 78":           "Sector 78 Noida",
    "sec 93":           "Sector 93 Noida",
    "sec 100":          "Sector 100 Noida",
    "sec 104":          "Sector 104 Noida",
    "sec 107":          "Sector 107 Noida",
    "sec 137":          "Sector 137 Noida",
    "sec 143":          "Sector 143 Noida",
    "sec 150":          "Sector 150 Noida",
    "sec 168":          "Sector 168 Noida",
    "sec 18":           "Sector 18 Noida",
    "sec 44":           "Sector 44 Noida",
    "sec 50":           "Sector 50 Noida",
    "knowledge park":   "Knowledge Park",
    "pari chowk":       "Pari Chowk",
    "yamuna":           "Yamuna Expressway",
}


def infer_locality(location: str, sector: str, city: str) -> str | None:
    text = " ".join(filter(None, [location, sector, city])).lower().strip()
    if not text:
        return None

    # Check aliases first (more specific)
    for alias, canonical in ALIASES.items():
        if alias in text:
            return canonical

    # Then check canonical list (case-insensitive substring)
    for loc in LOCALITIES:
        if loc.lower() in text:
            return loc

    # Sector number extraction: "sector 62" in free text
    m = re.search(r'\bsector\s*(\d+)\b', text)
    if m:
        return f"Sector {m.group(1)} Noida"

    return None


async def main():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    # Only process properties with no locality set
    cursor = db.properties.find(
        {"$or": [{"locality": {"$exists": False}}, {"locality": None}, {"locality": ""}]},
        {"id": 1, "title": 1, "location": 1, "sector": 1, "city": 1}
    )
    props = await cursor.to_list(1000)

    print(f"\nFound {len(props)} properties without locality\n")
    print(f"{'TITLE':<45} {'LOCATION':<30} {'SECTOR':<20} → LOCALITY")
    print("─" * 120)

    updated = 0
    skipped = 0

    for p in props:
        loc   = p.get("location", "") or ""
        sec   = p.get("sector", "")   or ""
        city  = p.get("city", "")     or ""
        title = p.get("title", "")    or ""
        pid   = p.get("id", str(p.get("_id", "")))

        inferred = infer_locality(loc, sec, city)

        if inferred:
            print(f"{title[:44]:<45} {loc[:29]:<30} {sec[:19]:<20} → ✅ {inferred}")
            if not DRY_RUN:
                await db.properties.update_one(
                    {"id": pid},
                    {"$set": {"locality": inferred}}
                )
            updated += 1
        else:
            print(f"{title[:44]:<45} {loc[:29]:<30} {sec[:19]:<20} → ❌ Could not infer")
            skipped += 1

    client.close()
    print(f"\n{'─' * 120}")
    print(f"Total: {len(props)} | Auto-tagged: {updated} | Could not infer: {skipped}")
    if DRY_RUN:
        print("\n⚠  DRY RUN — no changes saved. Set DRY_RUN = False to apply.")
    else:
        print(f"\n✅ {updated} properties updated in MongoDB.")


asyncio.run(main())
