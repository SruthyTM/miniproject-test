#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import User, AuthToken, QuizSession

def test_auth_session_ownership():
    db = SessionLocal()
    try:
        print("=== Testing Auth Session Ownership ===")
        
        # Check if session 43 exists and belongs to user
        session = db.query(QuizSession).filter(QuizSession.id == 43).first()
        if not session:
            print("Session 43 not found")
            return
        
        print(f"Session 43: User ID {session.user_id}")
        
        # Check if user exists
        user = db.query(User).filter(User.id == session.user_id).first()
        if not user:
            print(f"User {session.user_id} not found")
            return
        
        print(f"User: {user.email}")
        print(f"User Verified: {user.is_verified}")
        
        # Check if user has auth tokens
        tokens = db.query(AuthToken).filter(AuthToken.user_id == user.id).all()
        print(f"Auth tokens: {len(tokens)}")
        
        if tokens:
            for token in tokens:
                print(f"  Token: {token.token[:20]}...")
        
        # Test if session can be accessed by user
        print("Testing session ownership...")
        if session.user_id == user.id:
            print("Session belongs to user - OK")
        else:
            print("Session ownership mismatch - ERROR")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_auth_session_ownership()
