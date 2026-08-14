from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from datetime import datetime, timezone
import uuid

from core.config import APP_NAME, CORS_ORIGINS, ADMIN_EMAIL, ADMIN_PASSWORD
from core.database import close_db, get_db
from core.security import get_password_hash

from modules.auth.routes import router as auth_router
from modules.listings.routes import router as listings_router
from modules.leads.routes import router as leads_router
from modules.owners.routes import router as owners_router
from modules.agents.routes import router as agents_router
from modules.properties.routes import router as properties_router
from modules.inquiries.routes import router as inquiries_router
from modules.dashboard.routes import router as dashboard_router
from modules.whatsapp.webhook import router as whatsapp_webhook_router
from modules.user_auth.router import router as user_auth_router
from modules.blog.routes import router as blog_router
from modules.instagram.routes import router as instagram_router
from modules.faq.routes import router as faq_router
from modules.seo.sitemap_route import router as sitemap_router
from modules.referrals.routes import router as referrals_router
from modules.saved_properties.routes import router as saved_properties_router
from modules.admin_users.routes import router as admin_users_router
from modules.visits.routes import router as visits_router
from modules.user_profile.routes import router as user_profile_router


from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware

BASE_DIR = Path(__file__).parent

app = FastAPI(title=APP_NAME, redirect_slashes=False)
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts=["*"])
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.middleware("http")
async def security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self' https: data: blob: 'unsafe-inline'"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


# Static uploads
app.mount(
    "/uploads",
    StaticFiles(directory=BASE_DIR / "uploads"),
    name="uploads"
)

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global HTTP exception handler
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail
        },
    )

# Validation error handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Invalid request data",
            "errors": exc.errors()
        },
    )

# Generic exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Something went wrong. Please try again."
        },
    )

# Routers
app.include_router(auth_router, prefix="/api")
app.include_router(listings_router, prefix="/api")
app.include_router(leads_router, prefix="/api")
app.include_router(owners_router, prefix="/api")
app.include_router(agents_router, prefix="/api")
app.include_router(properties_router, prefix="/api")
app.include_router(inquiries_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(whatsapp_webhook_router)
app.include_router(user_auth_router)
app.include_router(blog_router, prefix="/api")
app.include_router(instagram_router, prefix="/api")
app.include_router(faq_router, prefix="/api")
app.include_router(sitemap_router)
app.include_router(referrals_router, prefix="/api")
app.include_router(saved_properties_router, prefix="/api")
app.include_router(admin_users_router, prefix="/api")
app.include_router(visits_router, prefix="/api")
app.include_router(user_profile_router, prefix="/api")


@app.on_event("startup")
async def startup():
    import os
    # Read directly from env — never rely on module-level import for seeding
    _email = os.environ.get("ADMIN_EMAIL", "admin@instamakaan.com")
    _pwd   = os.environ.get("ADMIN_PASSWORD", "Admin1234Makaan")

    db = get_db()

    # replace_one: single atomic op — replaces the whole document regardless
    # of what field names the old seed used (password_hash vs password, etc.)
    await db.users.replace_one(
        {"email": _email},
        {
            "id":         "admin-1",
            "email":      _email,
            "password":   get_password_hash(_pwd),
            "role":       "ADMIN",
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
        upsert=True,
    )
    try:
        await db.users.create_index("email", unique=True)
    except Exception:
        pass


@app.on_event("shutdown")
async def shutdown():
    close_db()
