#!/usr/bin/env python3
"""
Check if database has any quiz sessions
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import QuizSession, User

def check_database():
    """Check what's in the database"""
    db = SessionLocal()
    try:
        # Check total users
        total_users = db.query(User).count()
        print(f"Total users: {total_users}")
        
        # Check total sessions
        total_sessions = db.query(QuizSession).count()
        print(f"Total quiz sessions: {total_sessions}")
        
        # Check completed sessions
        completed_sessions = db.query(QuizSession).filter(QuizSession.completed == True).count()
        print(f"Completed sessions: {completed_sessions}")
        
        # Check sessions with creative text
        creative_sessions = db.query(QuizSession).filter(QuizSession.creative_text.isnot(None)).count()
        print(f"Sessions with creative text: {creative_sessions}")
        
        # Show sample sessions
        sessions = db.query(QuizSession).all()
        print(f"\nSample sessions:")
        for i, session in enumerate(sessions[:3]):
            print(f"  {i+1}. ID: {session.id}, User: {session.user_id}, Completed: {session.completed}, Creative: {bool(session.creative_text)}")
            if session.creative_text:
                print(f"      Text: {session.creative_text[:50]}...")
                print(f"      AI Score: {session.ai_score}, AI Sentiment: {session.ai_sentiment}")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_database()
