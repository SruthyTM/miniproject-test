#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import User, AuthToken, QuizSession
from app.ai_agent import score_creative_text_with_ai
from datetime import datetime
import random

def test_creative_direct():
    db = SessionLocal()
    try:
        print("=== Direct Creative Submission Test ===")
        
        # Get session 43
        session = db.query(QuizSession).filter(QuizSession.id == 43).first()
        if not session:
            print("Session 43 not found")
            return
        
        print(f"Session found: {session.id}, User: {session.user_id}")
        
        # Test creative text (exactly 25 words)
        creative_text = "one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty twenty-one twenty-two twenty-three twenty-four twenty-five"
        
        print(f"Creative text: {creative_text}")
        print(f"Word count: {len(creative_text.strip().split())}")
        
        # Test AI evaluation
        print("Testing AI evaluation...")
        ai_eval = score_creative_text_with_ai(creative_text)
        print(f"AI evaluation result: {ai_eval}")
        
        # Update session manually
        session.creative_text = creative_text
        session.ai_score = ai_eval.get("score", 5)
        session.ai_sentiment = ai_eval.get("sentiment", "Neutral")
        session.entry_reference = f"TBSC-{datetime.utcnow().strftime('%Y')}-{random.randint(100000, 999999)}"
        session.submitted_at = datetime.utcnow()
        
        print("Committing to database...")
        db.commit()
        
        print("✅ Manual creative submission successful!")
        print(f"Entry reference: {session.entry_reference}")
        print(f"AI Score: {session.ai_score}")
        print(f"AI Sentiment: {session.ai_sentiment}")
        
    except Exception as e:
        print(f"❌ Error in direct test: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    test_creative_direct()
