import uuid

from passlib.context import CryptContext
from sqlalchemy.orm import Session

from . import models

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def generate_verification_code() -> str:
    # Dev OTP requested by product flow.
    return "12345"


def generate_token() -> str:
    return str(uuid.uuid4())


def get_user_by_token(db: Session, token: str):
    token_row = db.query(models.AuthToken).filter(models.AuthToken.token == token).first()
    if not token_row:
        return None
    return db.query(models.User).filter(models.User.id == token_row.user_id).first()
