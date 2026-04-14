#!/usr/bin/env python3
"""
Fix all high scores (>10) to realistic values
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import QuizSession
from app.ai_agent import get_fallback_score, get_fallback_sentiment

def fix_all_high_scores():
    """Fix all sessions with scores > 10"""
    db = SessionLocal()
    try:
        # Find all sessions with scores > 10
        high_score_sessions = db.query(QuizSession).filter(QuizSession.ai_score > 10).all()
        
        print(f"Found {len(high_score_sessions)} sessions with scores > 10")
        
        fixed_count = 0
        for session in high_score_sessions:
            print(f"Session {session.id} - User: {session.user.email}")
            print(f"  Current score: {session.ai_score}, Current sentiment: {session.ai_sentiment}")
            
            if session.creative_text:
                new_score = get_fallback_score(session.creative_text)
                new_sentiment = get_fallback_sentiment(session.creative_text)
                
                print(f"  New score: {new_score}, New sentiment: {new_sentiment}")
                
                session.ai_score = new_score
                session.ai_sentiment = new_sentiment
                fixed_count += 1
            else:
                # For sessions without creative text, set to neutral values
                session.ai_score = 5
                session.ai_sentiment = "Neutral"
                print(f"  No creative text - Setting score: 5, sentiment: Neutral")
                fixed_count += 1
        
        db.commit()
        print(f"\nSuccessfully updated {fixed_count} sessions")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_all_high_scores()
