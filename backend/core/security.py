from datetime import datetime, timedelta, timezone
from typing import Optional, List
from uuid import uuid4

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import bcrypt as _bcrypt
from jose import JWTError, jwt

from core.config import JWT_SECRET, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from core.database import get_db

# =========================
# PASSWORD UTILS
# =========================

def get_password_hash(password: str) -> str:
    return _bcrypt.hashpw(password.encode("utf-8"), _bcrypt.gensalt(12)).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return _bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False

# =========================
# JWT CONFIG
# =========================

REFRESH_TOKEN_EXPIRE_DAYS = 7
ISSUER = "instamakaan"
AUDIENCE = "instamakaan_users"

security = HTTPBearer(auto_error=False)

# =========================
# TOKEN HELPERS
# =========================

def _base_payload(data: dict):
    return {
        **data,
        "iat": datetime.now(timezone.utc),
        "iss": ISSUER,
        "aud": AUDIENCE,
        "jti": str(uuid4()),
    }

def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
):
    payload = _base_payload(data)
    payload["type"] = "access"
    payload["exp"] = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(data: dict):
    payload = _base_payload(data)
    payload["type"] = "refresh"
    payload["exp"] = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

# =========================
# TOKEN DECODER
# =========================

def decode_token(token: str):
    try:
        return jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
            options={
                "verify_aud": False,
                "verify_iss": False,
            },
        )
    except JWTError:
        return None


# =========================
# CURRENT USER
# =========================
async def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db=Depends(get_db),
):
    # httpOnly cookie is invisible to JS (XSS-safe); fall back to Bearer for API clients
    token = request.cookies.get("access_token")
    if not token and credentials is not None:
        token = credentials.credentials

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    payload = decode_token(token)

    if not payload or payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = payload.get("sub")
    role = payload.get("role") or "USER"

    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = await db.users.find_one({"id": user_id}, {"_id": 0})

    if not user:
        return {
            "id": user_id,
            "role": role.upper(),
        }

    if "role" in user and isinstance(user["role"], str):
        user["role"] = user["role"].upper()

    return user

# =========================
# ROLE-BASED ACCESS CONTROL
# =========================

def require_role(roles: List[str]):
    normalized_roles = [r.upper() for r in roles]

    async def checker(user=Depends(get_current_user)):
        if user.get("role") not in normalized_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Forbidden"
            )
        return user

    return checker
