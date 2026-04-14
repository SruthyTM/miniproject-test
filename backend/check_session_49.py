#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import User, QuizSession

def check_session_49():
    db = SessionLocal()
    try:
        print("=== Checking Session 49 ===")
        
        # Find session 49
        session = db.query(QuizSession).filter(QuizSession.id == 49).first()
        
        if not session:
            print("❌ Session 49 not found")
            return
        
        print(f"✅ Session 49 found:")
        print(f"  User ID: {session.user_id}")
        print(f"  Completed: {session.completed}")
        print(f"  Score: {session.score}")
        print(f"  Creative Text: {session.creative_text}")
        print(f"  Submitted At: {session.submitted_at}")
        
        # Check if user exists
        user = db.query(User).filter(User.id == session.user_id).first()
        if user:
            print(f"  User Email: {user.email}")
        else:
            print(f"  User not found for ID {session.user_id}")
        
        # Check if session can accept creative submission
        if not session.completed:
            print("❌ Session not completed - cannot submit creative text")
        elif session.creative_text:
            print("❌ Creative text already submitted")
        else:
            print("✅ Session ready for creative submission")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    check_session_49()
