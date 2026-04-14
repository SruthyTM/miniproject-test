#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import requests
import json

def test_api():
    # Login to get token
    login_data = {
        "email": "test@example.com",
        "password": "test123"
    }
    
    try:
        # Login
        response = requests.post("http://127.0.0.1:8000/auth/login", json=login_data)
        if response.status_code != 200:
            print(f"Login failed: {response.status_code} - {response.text}")
            return
        
        token_data = response.json()
        token = token_data.get("token")
        if not token:
            print(f"No token in response: {token_data}")
            return
            
        print(f"Got token: {token[:20]}...")
        
        # Test dashboard API
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get("http://127.0.0.1:8000/admin/dashboard", headers=headers)
        
        if response.status_code != 200:
            print(f"Dashboard API failed: {response.status_code} - {response.text}")
            return
        
        dashboard_data = response.json()
        print("Dashboard response:")
        print(json.dumps(dashboard_data, indent=2))
        
        # Check specifically for creative_text
        creative_text = dashboard_data.get("creative_text")
        print(f"\nCreative text found: {creative_text}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_api()
