from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..security import (
    generate_token,
    generate_verification_code,
    hash_password,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
def register(payload: schemas.RegisterRequest, db: Session = Depends(get_db)):
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

    return {
        "message": "Registered. Please verify email before login.",
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
    return {"token": token, "email": user.email}


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
    return {"token": token, "email": user.email}
