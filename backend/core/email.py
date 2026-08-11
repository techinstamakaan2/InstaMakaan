import httpx
import logging
from core.config import BREVO_API_KEY, SMTP_FROM_EMAIL

logger = logging.getLogger(__name__)

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


async def send_email(to_email: str, subject: str, html_body: str):
    if not BREVO_API_KEY:
        raise RuntimeError("BREVO_API_KEY not configured")

    payload = {
        "sender": {"name": "InstaMakaan", "email": SMTP_FROM_EMAIL},
        "to": [{"email": to_email}],
        "subject": subject,
        "htmlContent": html_body,
    }

    async with httpx.AsyncClient(timeout=15) as client:
        res = await client.post(
            BREVO_API_URL,
            json=payload,
            headers={"api-key": BREVO_API_KEY, "Content-Type": "application/json"},
        )
        if res.status_code not in (200, 201):
            raise RuntimeError(f"Brevo API error {res.status_code}: {res.text}")


async def send_otp_email(to_email: str, otp: str, name: str = ""):
    greeting = f"Hi {name}," if name else "Hello,"
    subject = "Your InstaMakaan Verification Code"
    html_body = f"""
    <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 480px; margin: 0 auto;
                background: #0a1628; color: #f1f5f9; padding: 36px; border-radius: 16px;
                border: 1px solid rgba(20,184,166,0.2);">
      <div style="text-align: center; margin-bottom: 28px;">
        <span style="font-size: 26px; font-weight: 800; color: #14b8a6;">Insta</span>
        <span style="font-size: 26px; font-weight: 800; color: #fbbf24;">Makaan</span>
      </div>
      <h2 style="color: #f1f5f9; font-size: 20px; margin: 0 0 8px;">Verify your email</h2>
      <p style="color: #94a3b8; font-size: 14px; margin: 0 0 24px; line-height: 1.6;">
        {greeting} Use the code below to verify your InstaMakaan account.
        It expires in <strong style="color:#f1f5f9;">5 minutes</strong>.
      </p>
      <div style="background: rgba(20,184,166,0.08); border: 2px solid rgba(20,184,166,0.35);
                  border-radius: 14px; padding: 22px; text-align: center; margin-bottom: 24px;">
        <span style="font-size: 40px; font-weight: 900; letter-spacing: 14px; color: #2dd4bf;
                     font-family: monospace;">{otp}</span>
      </div>
      <p style="color: #475569; font-size: 13px; text-align: center; margin: 0;">
        Never share this code with anyone. InstaMakaan will never ask for it.
      </p>
      <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 28px 0 20px;" />
      <p style="color: #334155; font-size: 12px; text-align: center; margin: 0;">
        &copy; 2025 InstaMakaan. All rights reserved.
      </p>
    </div>
    """
    await send_email(to_email, subject, html_body)
