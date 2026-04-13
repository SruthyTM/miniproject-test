from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from . import models, security
from .database import Base, SessionLocal, engine
from .routers import admin, auth, eligibility, final_answer, quiz

load_dotenv()

Base.metadata.create_all(bind=engine)

# Create admin user if not exists
db: Session = SessionLocal()
admin_user = db.query(models.User).filter(models.User.email == "sruthy.m@thinkpalm.com").first()
if not admin_user:
    admin_user = models.User(
        email="sruthy.m@thinkpalm.com",
        password_hash=security.hash_password("123456"),
        is_verified=True,
        verification_code="000000",
        is_admin=True
    )
    db.add(admin_user)
    db.commit()
db.close()

app = FastAPI(title="Quiz Flow Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(eligibility.router)
app.include_router(quiz.router)
app.include_router(final_answer.router)
app.include_router(admin.router)


@app.get("/health")
def health():
    return {"status": "ok"}
