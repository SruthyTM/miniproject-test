#!/usr/bin/env python3
"""
Script to update existing quiz sessions with null sentiment values
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import QuizSession

def update_null_sentiments():
    """Update all sessions with null ai_sentiment to 'Neutral'"""
    db = SessionLocal()
    try:
        # Find all sessions with creative text but null sentiment
        sessions = db.query(QuizSession).filter(
            QuizSession.creative_text.isnot(None),
            QuizSession.ai_sentiment.is_(None)
        ).all()
        
        print(f"Found {len(sessions)} sessions with null sentiment")
        
        for session in sessions:
            session.ai_sentiment = "Neutral"
            print(f"Updated session {session.id} for user {session.user.email if session.user else 'Unknown'}")
        
        db.commit()
        print(f"Successfully updated {len(sessions)} sessions")
        
    except Exception as e:
        print(f"Error updating sentiments: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    update_null_sentiments()
