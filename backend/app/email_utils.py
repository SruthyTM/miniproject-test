import os
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import EmailStr
from dotenv import load_dotenv

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_FROM_NAME=os.getenv("MAIL_FROM_NAME", "Quiz App"),
    MAIL_STARTTLS=os.getenv("MAIL_STARTTLS", "True") == "True",
    MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS", "False") == "True",
    USE_CREDENTIALS=os.getenv("USE_CREDENTIALS", "True") == "True",
    VALIDATE_CERTS=os.getenv("VALIDATE_CERTS", "True") == "True"
)

async def send_otp_email(email: EmailStr, otp: str):
    html = f"""
    <html>
    <body style="font-family: sans-serif; background-color: #0B091A; color: #ffffff; padding: 40px; text-align: center;">
        <div style="max-width: 500px; margin: auto; background-color: #110e26; padding: 30px; border-radius: 20px; border: 1px solid #38346b;">
            <h2 style="color: #00E5FF; font-style: italic;">LUCID ENGINE AI</h2>
            <h1 style="color: #ffffff; font-size: 24px;">Verify Your Email</h1>
            <p style="color: #8a8ea8; font-size: 16px;">Use the 6-digit code below to activate your account:</p>
            <div style="background-color: #1D1B38; padding: 20px; border-radius: 10px; margin: 30px 0;">
                <span style="font-size: 36px; font-weight: bold; color: #FFA500; letter-spacing: 10px;">{otp}</span>
            </div>
            <p style="color: #5c5c7d; font-size: 12px;">This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
    </body>
    </html>
    """

    message = MessageSchema(
        subject="Your 6-Digit Verification Code",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    try:
        await fm.send_message(message)
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
