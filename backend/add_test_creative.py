#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import QuizSession, User
from datetime import datetime

def add_test_creative_text():
    db = SessionLocal()
    try:
        # Get the first user
        user = db.query(User).first()
        if not user:
            print("No users found in database")
            return
        
        # Get the first quiz session for this user
        session = db.query(QuizSession).filter(QuizSession.user_id == user.id).first()
        if not session:
            print("No quiz sessions found for user")
            return
        
        # Add creative text and mark as shortlisted
        session.creative_text = "I deserve this prize because my innovative solution combines cutting-edge technology with user-centered design to create meaningful impact."
        session.is_shortlisted = True
        session.ai_score = 94
        session.ai_sentiment = "Positive"
        session.entry_reference = f"ENTRY{session.id:06d}"
        session.submitted_at = datetime.utcnow()
        
        db.commit()
        print(f"Added creative text to session {session.id}")
        print(f"Creative text: {session.creative_text}")
        print(f"Is shortlisted: {session.is_shortlisted}")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_test_creative_text()
