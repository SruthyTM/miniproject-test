#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import User, QuizSession, AuthToken

def delete_sruthyymuraleedharan():
    db = SessionLocal()
    try:
        email_to_delete = "sruthyymuraleedharan@gmail.com"
        
        # Find user by email
        user = db.query(User).filter(User.email == email_to_delete).first()
        
        if not user:
            print(f"User {email_to_delete} not found in database")
            return
        
        print(f"Found user: {user.email} (ID: {user.id})")
        
        # Delete all quiz sessions for this user
        sessions = db.query(QuizSession).filter(QuizSession.user_id == user.id).all()
        session_count = len(sessions)
        
        if session_count > 0:
            db.query(QuizSession).filter(QuizSession.user_id == user.id).delete()
            print(f"Deleted {session_count} quiz sessions")
        
        # Delete all auth tokens for this user
        tokens = db.query(AuthToken).filter(AuthToken.user_id == user.id).all()
        token_count = len(tokens)
        
        if token_count > 0:
            db.query(AuthToken).filter(AuthToken.user_id == user.id).delete()
            print(f"Deleted {token_count} auth tokens")
        
        # Delete the user
        db.delete(user)
        db.commit()
        
        print(f"Successfully deleted user {email_to_delete} from database")
        print(f"Deleted: {session_count} sessions, {token_count} tokens, 1 user")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    delete_sruthyymuraleedharan()
