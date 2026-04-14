#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import QuizSession, User
from app.security import hash_password
from datetime import datetime

def create_test_data():
    db = SessionLocal()
    try:
        # Create or get a test user
        test_email = "test@example.com"
        user = db.query(User).filter(User.email == test_email).first()
        
        if not user:
            # Create proper password hash using bcrypt
            password_hash = hash_password("test123")
            user = User(
                email=test_email,
                password_hash=password_hash,
                is_verified=True,
                verification_code="123456"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"Created test user: {user.email}")
        
        # Create a quiz session
        session = QuizSession(
            user_id=user.id,
            score=85,
            completed=True,
            timed_out=False,
            creative_text="I deserve this prize because my innovative solution combines cutting-edge technology with user-centered design to create meaningful impact.",
            is_shortlisted=True,
            ai_score=94,
            ai_sentiment="Positive",
            entry_reference=f"ENTRY{user.id:06d}",
            submitted_at=datetime.utcnow()
        )
        
        db.add(session)
        db.commit()
        db.refresh(session)
        
        print(f"Created quiz session: {session.id}")
        print(f"Creative text: {session.creative_text}")
        print(f"Is shortlisted: {session.is_shortlisted}")
        print(f"AI Score: {session.ai_score}")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_data()
