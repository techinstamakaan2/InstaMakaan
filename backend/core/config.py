import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables
load_dotenv(BASE_DIR / ".env", override=True)

# App
APP_NAME = "InstaMakaan API"

# Database
MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME", "instamakaan")

# JWT — must be set in .env, no insecure default allowed
JWT_SECRET = os.environ.get("JWT_SECRET")
if not JWT_SECRET:
    raise RuntimeError(
        "JWT_SECRET is not set. Add it to backend/.env\n"
        "Generate one with: python -c \"import secrets; print(secrets.token_hex(32))\""
    )

JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")

# 60 minutes — short-lived access tokens
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 60)
)

# Admin seed credentials — read from env, no hardcoded fallback
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD")

# CORS — always include production Vercel URL; extend via CORS_ORIGINS env var
_cors_defaults = "http://localhost:5173,http://localhost:3000,https://instamakaann.vercel.app"
_cors_raw = os.environ.get("CORS_ORIGINS", _cors_defaults)
CORS_ORIGINS = list({o.strip() for o in _cors_raw.split(",") if o.strip()})

# Cookie security — use Secure+SameSite=none in production (cross-origin), lax in dev
ENVIRONMENT = os.environ.get("ENVIRONMENT", "development")
SECURE_COOKIES = ENVIRONMENT == "production"
COOKIE_SAMESITE = "none" if SECURE_COOKIES else "lax"

# Brevo — transactional email via HTTP API (works on all cloud providers)
BREVO_API_KEY = os.environ.get("BREVO_API_KEY", "")
SMTP_FROM_EMAIL = os.environ.get("SMTP_FROM_EMAIL", "techinstamakaan@gmail.com")

# App public URL — used to build referral links
APP_URL = os.environ.get("APP_URL", "https://instamakaann.vercel.app")
