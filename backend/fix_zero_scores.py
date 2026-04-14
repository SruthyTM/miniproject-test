#!/usr/bin/env python3
"""
Script to fix existing sessions with AI score of 0
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import QuizSession
from app.ai_agent import get_fallback_score

def fix_zero_scores():
    """Update all sessions with ai_score of 0 to use fallback scoring"""
    db = SessionLocal()
    try:
        # Find all sessions with creative text but ai_score of 0
        sessions = db.query(QuizSession).filter(
            QuizSession.creative_text.isnot(None),
            QuizSession.ai_score == 0
        ).all()
        
        print(f"Found {len(sessions)} sessions with AI score of 0")
        
        for session in sessions:
            fallback_score = get_fallback_score(session.creative_text)
            session.ai_score = fallback_score
            session.ai_sentiment = session.ai_sentiment or "Neutral"
            
            print(f"Updated session {session.id}: score 0 -> {fallback_score}")
            print(f"Text: {session.creative_text[:100]}...")
        
        db.commit()
        print(f"Successfully updated {len(sessions)} sessions")
        
    except Exception as e:
        print(f"Error updating scores: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_zero_scores()
