import re
import json
import httpx
from pathlib import Path
from fastapi import APIRouter
from fastapi.responses import Response
from core.database import get_db
from datetime import datetime

router = APIRouter(tags=["SEO"])

SITE_ROUTES_URL = "https://instamakaan.com/site-routes.json"
LOCAL_SITE_ROUTES_PATH = Path(__file__).resolve().parents[3] / "frontend" / "public" / "site-routes.json"
BASE = "https://instamakaan.com"


def _slug(text: str) -> str:
    text = (text or "").lower()
    text = re.sub(r"[^a-z0-9\s]", "", text)
    text = text.strip()
    return re.sub(r"\s+", "-", text)


def property_to_slug(prop_id: str, title: str, city: str = "", location: str = "") -> str:
    parts = [_slug(title), _slug(city or location), (prop_id or "")[:8]]
    return "-".join(p for p in parts if p)


def _url(loc, priority, changefreq, lastmod):
    return f"""
  <url>
    <loc>{loc}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>{changefreq}</changefreq>
    <priority>{priority}</priority>
  </url>"""


@router.get("/sitemap.xml", include_in_schema=False)
async def generate_sitemap():
    """
    Dynamic XML sitemap — fully automatic:
    1. Static pages      — from site-routes.json
    2. Rent SEO pages    — auto-generated from property locality/city/sector + BHK combos
    3. Blog posts        — all published posts from MongoDB
    4. Properties        — all active listings from MongoDB
    """
    db = get_db()
    today = datetime.utcnow().strftime("%Y-%m-%d")
    urls = []

    # ── 1. Static pages ───────────────────────────────────────────────────────
    # Prefer the local file (always up to date, no network round-trip) and only
    # fall back to fetching the deployed copy if the local file isn't reachable
    # (e.g. frontend and backend are hosted on separate servers in production).
    try:
        routes = None
        if LOCAL_SITE_ROUTES_PATH.exists():
            routes = json.loads(LOCAL_SITE_ROUTES_PATH.read_text(encoding="utf-8")).get("routes", [])
        else:
            async with httpx.AsyncClient(timeout=5) as client:
                resp = await client.get(SITE_ROUTES_URL)
                if resp.status_code == 200:
                    routes = resp.json().get("routes", [])

        for route in routes or []:
            urls.append(_url(
                f"{BASE}{route['path']}",
                route["priority"],
                route["changefreq"],
                today,
            ))
    except Exception:
        pass

    # ── 2. Dynamic rent SEO pages (only for area/BHK combos with real listings) ──
    try:
        # Pull just the fields we need for every active listing, once, and
        # compute which areas (and which BHK types within each area) actually
        # have at least one live property. This keeps the sitemap free of
        # dead-end "0 properties available" pages, and stays automatically in
        # sync as properties are added/removed by admins.
        cursor = db.properties.find(
            {"status": "active"},
            {"locality": 1, "city": 1, "sector": 1, "beds": 1, "_id": 0},
        )
        area_beds_map = {}
        async for doc in cursor:
            area = doc.get("locality") or doc.get("city") or doc.get("sector")
            area_slug = _slug(area) if area else None
            if not area_slug:
                continue
            beds = area_beds_map.setdefault(area_slug, set())
            if doc.get("beds"):
                beds.add(doc["beds"])

        for area_slug, beds_set in area_beds_map.items():
            # Base area page: /rent/flats-for-rent-in-[area]
            urls.append(_url(
                f"{BASE}/rent/flats-for-rent-in-{area_slug}",
                "0.8",
                "daily",
                today,
            ))

            # BHK-specific pages: /rent/[n]-bhk-flats-for-rent-in-[area]
            for bhk in sorted(beds_set):
                urls.append(_url(
                    f"{BASE}/rent/{bhk}-bhk-flats-for-rent-in-{area_slug}",
                    "0.7",
                    "daily",
                    today,
                ))

        # Society/locality review pages: /society-reviews/[area] — one entry per area
        urls.append(_url(f"{BASE}/society-reviews", "0.6", "weekly", today))
        for area_slug in area_beds_map:
            urls.append(_url(
                f"{BASE}/society-reviews/{area_slug}",
                "0.6",
                "weekly",
                today,
            ))
    except Exception:
        pass

    # ── 3. Blog posts ─────────────────────────────────────────────────────────
    try:
        blog_cursor = db["blogs"].find(
            {"status": "published"},
            {"slug": 1, "_id": 1, "updated_at": 1}
        ).sort("updated_at", -1)
        for post in await blog_cursor.to_list(length=None):
            slug = post.get("slug") or str(post.get("_id", ""))
            if not slug:
                continue
            updated = post.get("updated_at")
            lastmod = updated.strftime("%Y-%m-%d") if updated else today
            urls.append(_url(f"{BASE}/blog/{slug}", "0.7", "monthly", lastmod))
    except Exception:
        pass

    # ── 4. Active property listings ───────────────────────────────────────────
    try:
        prop_cursor = db["properties"].find(
            {"status": "active"},
            {"_id": 1, "id": 1, "title": 1, "city": 1, "location": 1, "updated_at": 1}
        ).sort("updated_at", -1)
        for prop in await prop_cursor.to_list(length=None):
            prop_id = str(prop.get("id") or prop.get("_id", ""))
            if not prop_id:
                continue
            slug = property_to_slug(
                prop_id, prop.get("title"), prop.get("city"), prop.get("location")
            )
            updated = prop.get("updated_at")
            lastmod = updated.strftime("%Y-%m-%d") if updated else today
            urls.append(_url(f"{BASE}/property/{slug}", "0.6", "weekly", lastmod))
    except Exception:
        pass

    xml_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{"".join(urls)}
</urlset>"""

    return Response(
        content=xml_content,
        media_type="application/xml",
        headers={"Cache-Control": "public, max-age=3600"},
    )
