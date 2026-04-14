#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import User
from app.security import verify_password

def debug_auth():
    db = SessionLocal()
    try:
        # Check if test user exists
        user = db.query(User).filter(User.email == "test@example.com").first()
        if not user:
            print("Test user not found")
            return
        
        print(f"User found: {user.email}")
        print(f"Is verified: {user.is_verified}")
        print(f"Password hash: {user.password_hash}")
        
        # Test password verification
        is_valid = verify_password("test123", user.password_hash)
        print(f"Password verification result: {is_valid}")
        
        # Check for quiz sessions
        from app.models import QuizSession
        sessions = db.query(QuizSession).filter(QuizSession.user_id == user.id).all()
        print(f"Found {len(sessions)} quiz sessions")
        
        for session in sessions:
            print(f"Session {session.id}: creative_text = {repr(session.creative_text)}, is_shortlisted = {session.is_shortlisted}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    debug_auth()
