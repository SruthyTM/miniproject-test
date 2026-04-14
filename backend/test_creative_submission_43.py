#!/usr/bin/env python3

import sys
import os
import requests
import json
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import User, AuthToken

def test_creative_submission_43():
    db = SessionLocal()
    try:
        print("=== Testing Creative Submission for Session 43 ===")
        
        # Get user and token for testing
        user = db.query(User).filter(User.email == "sruthyymuraleedharan@gmail.com").first()
        if not user:
            print("❌ User not found - need to register first")
            return
        
        # Create auth token for testing
        token = "test-token-" + str(os.urandom(8).hex())
        auth_token = AuthToken(token=token, user_id=user.id)
        db.add(auth_token)
        db.commit()
        
        print(f"✅ User: {user.email}")
        print(f"✅ Test Token: {token}")
        
        # Test creative submission data
        creative_text = "I deserve this prize because my innovative solution combines cutting-edge technology with user-centered design to create meaningful impact and transform the future."
        
        # Check word count
        word_count = len(creative_text.strip().split())
        print(f"✅ Creative text: {creative_text[:50]}...")
        print(f"✅ Word count: {word_count}")
        
        if word_count != 25:
            print(f"❌ Word count issue: {word_count} (need exactly 25)")
            return
        
        # Make API request
        url = "http://127.0.0.1:8000/quiz/43/creative"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        data = {
            "text": creative_text
        }
        
        print(f"\n=== Making API Request ===")
        print(f"URL: {url}")
        print(f"Headers: {headers}")
        print(f"Data: {json.dumps(data, indent=2)}")
        
        try:
            response = requests.post(url, headers=headers, json=data, timeout=30)
            print(f"\n=== API Response ===")
            print(f"Status Code: {response.status_code}")
            print(f"Headers: {dict(response.headers)}")
            
            if response.status_code == 200:
                print(f"Response Body: {json.dumps(response.json(), indent=2)}")
                print("✅ Creative submission successful!")
            else:
                print(f"Error Response: {response.text}")
                print(f"❌ Creative submission failed")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Request Error: {e}")
        
        # Clean up test token
        db.delete(auth_token)
        db.commit()
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_creative_submission_43()
