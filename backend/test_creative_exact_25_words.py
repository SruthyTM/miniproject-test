#!/usr/bin/env python3

import sys
import os
import requests
import json
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import User, AuthToken

def test_creative_exact_25_words():
    db = SessionLocal()
    try:
        print("=== Testing Creative Submission with EXACT 25 Words ===")
        
        # Get user and create token
        user = db.query(User).filter(User.email == "sruthyymuraleedharan@gmail.com").first()
        if not user:
            print("User not found")
            return
        
        token = "test-token-" + str(os.urandom(8).hex())
        auth_token = AuthToken(token=token, user_id=user.id)
        db.add(auth_token)
        db.commit()
        
        # Exactly 25 words - carefully counted
        creative_text = "one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty twenty-one twenty-two twenty-three twenty-four twenty-five"
        
        word_count = len(creative_text.strip().split())
        print(f"Text: {creative_text}")
        print(f"Word count: {word_count}")
        
        if word_count != 25:
            print(f"Word count issue: {word_count}")
            return
        
        # Test API
        url = "http://127.0.0.1:8000/quiz/43/creative"
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        data = {"text": creative_text}
        
        try:
            response = requests.post(url, headers=headers, json=data, timeout=30)
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                print("Success!")
                print(f"Response: {response.json()}")
            else:
                print(f"Error: {response.text}")
        except Exception as e:
            print(f"Request error: {e}")
        
        # Clean up
        db.delete(auth_token)
        db.commit()
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_creative_exact_25_words()
