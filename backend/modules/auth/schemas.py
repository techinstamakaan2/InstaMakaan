from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional

MAX_PASSWORD_BYTES = 72


class UserCreate(BaseModel):
    email: EmailStr
    name: Optional[str] = ""
    phone: Optional[str] = ""
    ref_code: Optional[str] = ""  # referral code from URL ?ref=


class UserLogin(BaseModel):
    email: EmailStr
    password: str

    @validator("password")
    def password_length_limit(cls, v: str):
        if len(v.encode("utf-8")) > MAX_PASSWORD_BYTES:
            raise ValueError("Password too long (max 72 characters allowed)")
        return v


class AdminLogin(BaseModel):
    email: EmailStr
    password: str

    @validator("password")
    def password_length_limit(cls, v: str):
        if len(v.encode("utf-8")) > MAX_PASSWORD_BYTES:
            raise ValueError("Password too long (max 72 characters allowed)")
        return v


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str = Field(min_length=6, max_length=6)


class ResendOTPRequest(BaseModel):
    email: EmailStr


class RequestLoginOTPRequest(BaseModel):
    email: EmailStr


class LoginWithOTPRequest(BaseModel):
    email: EmailStr
    otp: str = Field(min_length=6, max_length=6)

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
