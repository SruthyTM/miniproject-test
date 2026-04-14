#!/usr/bin/env python3
"""
Script to check existing quiz sessions and their AI evaluation data
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import QuizSession

def check_sessions():
    """Check all quiz sessions and their AI data"""
    db = SessionLocal()
    try:
        # Get all sessions
        all_sessions = db.query(QuizSession).all()
        print(f"Total sessions: {len(all_sessions)}")
        
        # Get completed sessions
        completed_sessions = db.query(QuizSession).filter(QuizSession.completed == True).all()
        print(f"Completed sessions: {len(completed_sessions)}")
        
        # Get sessions with creative text
        creative_sessions = db.query(QuizSession).filter(QuizSession.creative_text.isnot(None)).all()
        print(f"Sessions with creative text: {len(creative_sessions)}")
        
        print("\nSample sessions with creative text:")
        for session in creative_sessions[:3]:  # Show first 3
            print(f"Session ID: {session.id}")
            print(f"User ID: {session.user_id}")
            print(f"Completed: {session.completed}")
            print(f"Creative Text: {session.creative_text[:50] if session.creative_text else 'None'}...")
            print(f"AI Score: {session.ai_score}")
            print(f"AI Sentiment: {session.ai_sentiment}")
            print(f"Entry Reference: {session.entry_reference}")
            print("---")
            
    except Exception as e:
        print(f"Error checking sessions: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_sessions()
