#!/usr/bin/env python3
"""
Test specific session sentiment analysis
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import QuizSession
from app.ai_agent import get_fallback_sentiment

def test_specific_session():
    """Test session 41 specifically"""
    db = SessionLocal()
    try:
        # Get session 41
        session = db.query(QuizSession).filter(QuizSession.id == 41).first()
        
        if session:
            print(f"Session 41 found:")
            print(f"  Email: {session.user.email}")
            print(f"  Creative Text: {session.creative_text}")
            print(f"  Current AI Score: {session.ai_score}")
            print(f"  Current AI Sentiment: {session.ai_sentiment}")
            
            # Test sentiment analysis
            new_sentiment = get_fallback_sentiment(session.creative_text)
            print(f"  New AI Sentiment: {new_sentiment}")
            
            # Update the session
            session.ai_sentiment = new_sentiment
            db.commit()
            print(f"  Updated session 41 sentiment: {session.ai_sentiment}")
        else:
            print("Session 41 not found!")
            
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    test_specific_session()
