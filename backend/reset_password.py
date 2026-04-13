from app.database import SessionLocal
from app import models, security
from sqlalchemy.orm import Session

db: Session = SessionLocal()
email = "sruthy.m@thinkpalm.com"
password = "123456"

user = db.query(models.User).filter(models.User.email == email).first()

if user:
    print(f"User {email} found. Resetting password...")
    user.password_hash = security.hash_password(password)
    user.is_verified = True
    user.is_admin = True
    db.commit()
    print("Password reset and user updated.")
else:
    print(f"User {email} not found. Creating...")
    user = models.User(
        email=email,
        password_hash=security.hash_password(password),
        is_verified=True,
        verification_code="000000",
        is_admin=True
    )
    db.add(user)
    db.commit()
    print("User created and password set.")

db.close()
