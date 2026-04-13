from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..security import (
    generate_token,
    generate_verification_code,
    hash_password,
    verify_password,
)
from ..email_utils import send_otp_email

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
async def register(payload: schemas.RegisterRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    code = generate_verification_code()
    user = models.User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        is_verified=False,
        verification_code=code,
    )
    db.add(user)
    db.commit()

    # Send real email in the background
    background_tasks.add_task(send_otp_email, payload.email, code)

    return {
        "message": "Registered. Please verify email before login.",
        "verification_code": code,
    }


@router.post("/resend-otp")
async def resend_otp(payload: schemas.RegisterRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.is_verified:
        raise HTTPException(status_code=400, detail="User already verified")

    code = generate_verification_code()
    user.verification_code = code
    db.commit()

    # Send real email in the background
    background_tasks.add_task(send_otp_email, payload.email, code)

    return {
        "message": "New OTP sent successfully",
        "verification_code": code,
    }


@router.post("/verify-email", response_model=schemas.AuthResponse)
def verify_email(payload: schemas.VerifyRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.verification_code != payload.code:
        raise HTTPException(status_code=400, detail="Invalid verification code")
    user.is_verified = True
    token = generate_token()
    token_row = models.AuthToken(token=token, user_id=user.id)
    db.add(token_row)
    db.commit()
    return {"token": token, "email": user.email, "is_admin": user.is_admin}


@router.post("/login", response_model=schemas.AuthResponse)
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Please verify your email first")

    token = generate_token()
    token_row = models.AuthToken(token=token, user_id=user.id)
    db.add(token_row)
    db.commit()
    return {"token": token, "email": user.email, "is_admin": user.is_admin}
