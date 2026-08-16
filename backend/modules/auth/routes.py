from fastapi import APIRouter, HTTPException, Depends, Response, BackgroundTasks
from typing import Optional
from datetime import datetime, timezone, timedelta
import uuid
import random
import string
import logging

logger = logging.getLogger(__name__)

from core.database import get_db
from core.config import SECURE_COOKIES, COOKIE_SAMESITE, ACCESS_TOKEN_EXPIRE_MINUTES
from core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    get_current_user,
)
from core.email import send_otp_email
from modules.auth.schemas import (
    UserCreate,
    UserLogin,
    AdminLogin,
    TokenResponse,
    RefreshTokenRequest,
    VerifyOTPRequest,
    ResendOTPRequest,
    RequestLoginOTPRequest,
    LoginWithOTPRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)

router = APIRouter(prefix="/auth", tags=["Auth"])

REFRESH_MAX_AGE = 7 * 24 * 60 * 60  # 7 days
OTP_EXPIRY_MINUTES = 5


# ── helpers ──────────────────────────────────────────────────────────────────

def _issue_tokens(user_id: str, role: str):
    access = create_access_token({"sub": user_id, "role": role})
    refresh = create_refresh_token({"sub": user_id, "role": role})
    return access, refresh


def _set_auth_cookies(response: Response, access: str, refresh: str) -> None:
    response.set_cookie(
        key="access_token",
        value=access,
        httponly=True,
        secure=SECURE_COOKIES,
        samesite=COOKIE_SAMESITE,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh,
        httponly=True,
        secure=SECURE_COOKIES,
        samesite=COOKIE_SAMESITE,
        max_age=REFRESH_MAX_AGE,
        path="/",
    )


def _clear_auth_cookies(response: Response) -> None:
    response.delete_cookie("access_token", path="/", samesite=COOKIE_SAMESITE)
    response.delete_cookie("refresh_token", path="/", samesite=COOKIE_SAMESITE)


def _generate_otp() -> str:
    return "".join(random.choices(string.digits, k=6))


def _generate_referral_code() -> str:
    return str(uuid.uuid4())[:8].upper()


async def _send_otp_bg(email: str, otp: str, name: str):
    try:
        await send_otp_email(email, otp, name)
    except Exception as e:
        logger.error(f"Email send failed for {email}: {type(e).__name__}: {e}")


async def _store_otp(db, email: str, otp: str):
    expires_at = (datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRY_MINUTES)).isoformat()
    await db.otp_store.replace_one(
        {"email": email},
        {"email": email, "otp": otp, "expires_at": expires_at},
        upsert=True,
    )


async def _validate_otp(db, email: str, otp: str):
    record = await db.otp_store.find_one({"email": email})
    if not record:
        raise HTTPException(status_code=400, detail="No OTP found. Please request a new one.")
    expires_at = datetime.fromisoformat(record["expires_at"])
    if datetime.now(timezone.utc) > expires_at:
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one.")
    if record["otp"] != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP. Please try again.")


# ── REGISTER (no password — OTP only) ────────────────────────────────────────

@router.post("/register")
async def register(payload: UserCreate, background_tasks: BackgroundTasks, db=Depends(get_db)):
    existing = await db.users.find_one({"email": payload.email})
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    referred_by = None
    if payload.ref_code:
        referrer = await db.users.find_one({"referral_code": payload.ref_code.upper()})
        if referrer:
            referred_by = payload.ref_code.upper()

    user_id = str(uuid.uuid4())
    referral_code = _generate_referral_code()

    await db.users.insert_one({
        "id": user_id,
        "email": payload.email,
        "name": payload.name or "",
        "phone": payload.phone or "",
        "role": "USER",
        "referral_code": referral_code,
        "referred_by": referred_by,
        "wallet_balance": 0,
        "email_verified": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    otp = _generate_otp()
    await _store_otp(db, payload.email, otp)
    background_tasks.add_task(_send_otp_bg, payload.email, otp, payload.name or "")

    return {"message": "Account created! Check your email for the verification code."}


# ── VERIFY EMAIL ─────────────────────────────────────────────────────────────

@router.post("/verify-email")
async def verify_email(payload: VerifyOTPRequest, db=Depends(get_db)):
    await _validate_otp(db, payload.email, payload.otp)

    result = await db.users.update_one(
        {"email": payload.email},
        {"$set": {"email_verified": True}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    await db.otp_store.delete_one({"email": payload.email})
    return {"message": "Email verified successfully! You can now sign in."}


# ── RESEND OTP ────────────────────────────────────────────────────────────────

@router.post("/resend-otp")
async def resend_otp(payload: ResendOTPRequest, background_tasks: BackgroundTasks, db=Depends(get_db)):
    user = await db.users.find_one({"email": payload.email})
    if not user:
        raise HTTPException(status_code=404, detail="No account found with this email")
    if user.get("email_verified"):
        raise HTTPException(status_code=400, detail="Email is already verified")

    otp = _generate_otp()
    await _store_otp(db, payload.email, otp)
    background_tasks.add_task(_send_otp_bg, payload.email, otp, user.get("name", ""))

    return {"message": "New OTP sent to your email"}


# ── REQUEST LOGIN OTP ────────────────────────────────────────────────────────

@router.post("/request-login-otp")
async def request_login_otp(payload: RequestLoginOTPRequest, background_tasks: BackgroundTasks, db=Depends(get_db)):
    user = await db.users.find_one({"email": payload.email})
    if not user:
        raise HTTPException(status_code=404, detail="No account found with this email. Please sign up first.")
    if user.get("role") != "USER":
        raise HTTPException(status_code=403, detail="Please use the password login for this account.")

    otp = _generate_otp()
    await _store_otp(db, payload.email, otp)
    background_tasks.add_task(_send_otp_bg, payload.email, otp, user.get("name", ""))

    return {"message": "OTP sent to your email"}


# ── LOGIN WITH OTP ────────────────────────────────────────────────────────────

@router.post("/login-otp", response_model=TokenResponse)
async def login_with_otp(payload: LoginWithOTPRequest, response: Response, db=Depends(get_db)):
    user = await db.users.find_one({"email": payload.email})
    if not user:
        raise HTTPException(status_code=404, detail="No account found with this email")

    await _validate_otp(db, payload.email, payload.otp)
    await db.otp_store.delete_one({"email": payload.email})

    # Mark email verified on first OTP login
    if not user.get("email_verified"):
        await db.users.update_one({"email": payload.email}, {"$set": {"email_verified": True}})

    access, refresh = _issue_tokens(user["id"], user["role"])
    _set_auth_cookies(response, access, refresh)

    return {
        "access_token": access,
        "refresh_token": refresh,
        "token_type": "bearer",
    }


# ── LOGIN (password — kept for admin/owner/agent only) ───────────────────────

@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin, response: Response, db=Depends(get_db)):
    user = await db.users.find_one({"email": payload.email})

    if not user or not verify_password(payload.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # email_verified defaults to True for pre-existing users (admin, owners, agents)
    if not user.get("email_verified", True) and user.get("role") == "USER":
        raise HTTPException(
            status_code=403,
            detail="Please verify your email first",
            headers={"X-Needs-Verification": "true"},
        )

    access, refresh = _issue_tokens(user["id"], user["role"])
    _set_auth_cookies(response, access, refresh)

    return {
        "access_token": access,
        "refresh_token": refresh,
        "token_type": "bearer",
    }


# ── ADMIN LOGIN ───────────────────────────────────────────────────────────────

@router.post("/admin/auth/login", response_model=TokenResponse)
async def admin_login(payload: AdminLogin, response: Response, db=Depends(get_db)):
    user = await db.users.find_one({"email": payload.email})

    if not user or user.get("role") != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin access required")

    if not verify_password(payload.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid admin credentials")

    access, refresh = _issue_tokens(user["id"], user["role"])
    _set_auth_cookies(response, access, refresh)

    return {
        "access_token": access,
        "refresh_token": refresh,
        "token_type": "bearer",
    }


# ── REFRESH TOKEN ─────────────────────────────────────────────────────────────

@router.post("/refresh")
async def refresh(payload: RefreshTokenRequest):
    data = decode_token(payload.refresh_token)

    if not data or data.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user_id = data.get("sub")
    role = data.get("role", "USER")
    access = create_access_token({"sub": user_id, "role": role})

    return {"access_token": access, "token_type": "bearer"}


# ── LOGOUT ────────────────────────────────────────────────────────────────────

@router.post("/logout")
async def logout(response: Response, payload: Optional[RefreshTokenRequest] = None):
    _clear_auth_cookies(response)
    return {"message": "Logged out"}


# ── ME — restore session on page refresh ──────────────────────────────────────

@router.get("/me")
async def get_me(current_user=Depends(get_current_user), db=Depends(get_db)):
    user = await db.users.find_one({"id": current_user["id"]})
    access = create_access_token({"sub": current_user["id"], "role": current_user["role"]})
    return {
        "access_token": access,
        "email": current_user["email"],
        "role": current_user["role"],
        "name": user.get("name", "") if user else "",
        "phone": user.get("phone", "") if user else "",
        "referral_code": user.get("referral_code", "") if user else "",
        "wallet_balance": user.get("wallet_balance", 0) if user else 0,
    }

# ── FORGOT PASSWORD ───────────────────────────────────────────────────────────

@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest, db=Depends(get_db)):
    user = await db.users.find_one({"email": payload.email})
    if not user:
        # Prevent email enumeration by returning a generic success message
        return {"message": "Password reset link sent"}
    
    token = str(uuid.uuid4())
    # Save the token in DB with expiration (e.g., 15 mins)
    expires_at = (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()
    await db.reset_tokens.replace_one(
        {"email": payload.email},
        {"email": payload.email, "token": token, "expires_at": expires_at},
        upsert=True
    )
    
    return {"message": "Password reset link sent", "debug_token": token}


# ── RESET PASSWORD ────────────────────────────────────────────────────────────

@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest, db=Depends(get_db)):
    record = await db.reset_tokens.find_one({"token": payload.token})
    if not record:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    expires_at = datetime.fromisoformat(record["expires_at"])
    if datetime.now(timezone.utc) > expires_at:
        raise HTTPException(status_code=400, detail="Reset token has expired")
    
    hashed_password = get_password_hash(payload.new_password)
    result = await db.users.update_one(
        {"email": record["email"]},
        {"$set": {"password": hashed_password}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
        
    await db.reset_tokens.delete_one({"token": payload.token})
    return {"message": "Password reset successfully"}
