#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import QuizSession, User

def check_session_data():
    db = SessionLocal()
    try:
        # Get the test user
        user = db.query(User).filter(User.email == "test@example.com").first()
        if not user:
            print("Test user not found")
            return
        
        print(f"User ID: {user.id}")
        
        # Get all sessions for this user
        sessions = db.query(QuizSession).filter(QuizSession.user_id == user.id).all()
        print(f"Found {len(sessions)} sessions:")
        
        for session in sessions:
            print(f"\nSession {session.id}:")
            print(f"  creative_text: {repr(session.creative_text)}")
            print(f"  is_shortlisted: {session.is_shortlisted}")
            print(f"  ai_score: {session.ai_score}")
            print(f"  entry_reference: {session.entry_reference}")
            print(f"  submitted_at: {session.submitted_at}")
        
        # Simulate the dashboard logic
        shortlisted_session = next((s for s in sessions if s.is_shortlisted), None)
        print(f"\nShortlisted session: {shortlisted_session.id if shortlisted_session else None}")
        if shortlisted_session:
            print(f"  creative_text: {repr(shortlisted_session.creative_text)}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    check_session_data()
