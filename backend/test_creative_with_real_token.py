#!/usr/bin/env python3

import sys
import os
import requests
import json
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import User, AuthToken, QuizSession

def test_creative_with_real_token():
    db = SessionLocal()
    try:
        print("=== Testing Creative Submission with Real Auth Token ===")
        
        # Get user and session
        user = db.query(User).filter(User.email == "sruthyymuraleedharan@gmail.com").first()
        session = db.query(QuizSession).filter(QuizSession.id == 43).first()
        
        if not user or not session:
            print("User or session not found")
            return
        
        # Get a real auth token
        auth_token = db.query(AuthToken).filter(AuthToken.user_id == user.id).first()
        if not auth_token:
            print("No auth token found")
            return
        
        print(f"Using token: {auth_token.token}")
        
        # 25-word creative text
        creative_text = "one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty twenty-one twenty-two twenty-three twenty-four twenty-five"
        
        # Test API
        url = "http://127.0.0.1:8000/quiz/43/creative"
        headers = {"Authorization": f"Bearer {auth_token.token}", "Content-Type": "application/json"}
        data = {"text": creative_text}
        
        print(f"Making request to: {url}")
        print(f"Headers: {headers}")
        print(f"Data word count: {len(creative_text.split())}")
        
        try:
            response = requests.post(url, headers=headers, json=data, timeout=30)
            print(f"\n=== API Response ===")
            print(f"Status Code: {response.status_code}")
            print(f"Response Headers: {dict(response.headers)}")
            
            if response.status_code == 200:
                print(f"Response Body: {json.dumps(response.json(), indent=2)}")
                print("SUCCESS!")
            else:
                print(f"Error Response: {response.text}")
                print("FAILED!")
                
        except requests.exceptions.RequestException as e:
            print(f"Request Error: {e}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_creative_with_real_token()
