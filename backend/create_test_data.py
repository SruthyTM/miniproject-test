#!/usr/bin/env python3
"""
Script to create test data with AI evaluation
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import User, QuizSession
from datetime import datetime
import random

def create_test_data():
    """Create test quiz session with AI evaluation data"""
    db = SessionLocal()
    try:
        # Get the admin user
        admin_user = db.query(User).filter(User.email == "sruthy.m@thinkpalm.com").first()
        if not admin_user:
            print("Admin user not found!")
            return
            
        # Create a test quiz session
        test_session = QuizSession(
            user_id=admin_user.id,
            current_index=5,
            score=20,
            completed=True,
            timed_out=False,
            creative_text="I dream of cruising down coastal highways feeling the wind in my hair as the sunset paints the sky in brilliant orange hues while my favorite music plays perfectly.",
            ai_score=8,
            ai_sentiment="Enthusiastic",
            entry_reference=f"TBSC-{datetime.utcnow().strftime('%Y')}-{random.randint(100000, 999999)}",
            submitted_at=datetime.utcnow(),
            is_shortlisted=False,
            is_rejected=False
        )
        
        db.add(test_session)
        db.commit()
        
        print(f"Created test session with ID: {test_session.id}")
        print(f"AI Score: {test_session.ai_score}")
        print(f"AI Sentiment: {test_session.ai_sentiment}")
        print(f"Creative Text: {test_session.creative_text}")
        
    except Exception as e:
        print(f"Error creating test data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_data()
