#!/usr/bin/env python3
"""
Debug the fix_scores parameter issue
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import QuizSession
from app.ai_agent import get_fallback_score, get_fallback_sentiment

def debug_fix():
    """Debug the fix functionality"""
    db = SessionLocal()
    try:
        # Test with fix_scores = True
        sessions = db.query(QuizSession).join(QuizSession.user).filter(QuizSession.completed == True).all()
        
        print(f"Found {len(sessions)} completed sessions")
        
        fixed_count = 0
        for s in sessions:
            print(f"Session {s.id}: creative_text={bool(s.creative_text)}, ai_score={s.ai_score}")
            
            if s.creative_text and (s.ai_score == 0 or s.ai_score is None):
                ai_score = get_fallback_score(s.creative_text)
                ai_sentiment = get_fallback_sentiment(s.creative_text)
                
                print(f"  Fixing: score {s.ai_score} -> {ai_score}, sentiment -> {ai_sentiment}")
                
                s.ai_score = ai_score
                s.ai_sentiment = ai_sentiment
                fixed_count += 1
        
        print(f"Fixed {fixed_count} sessions")
        db.commit()
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    debug_fix()
