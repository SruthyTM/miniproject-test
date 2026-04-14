#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import QuizSession, User
from app.security import hash_password
from datetime import datetime

def reset_test_user():
    db = SessionLocal()
    try:
        # Delete existing test user and their sessions
        test_email = "test@example.com"
        user = db.query(User).filter(User.email == test_email).first()
        
        if user:
            # Delete all sessions for this user
            db.query(QuizSession).filter(QuizSession.user_id == user.id).delete()
            db.delete(user)
            db.commit()
            print(f"Deleted existing user: {test_email}")
        
        # Create new user with proper password hash
        password_hash = hash_password("test123")
        print(f"Generated password hash: {password_hash}")
        
        user = User(
            email=test_email,
            password_hash=password_hash,
            is_verified=True,
            verification_code="123456"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"Created new test user: {user.email}")
        
        # Create quiz session with creative text
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
            submitted_at=datetime.now()
        )
        
        db.add(session)
        db.commit()
        db.refresh(session)
        
        print(f"Created quiz session: {session.id}")
        print(f"Creative text: {session.creative_text}")
        print(f"Is shortlisted: {session.is_shortlisted}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_test_user()
