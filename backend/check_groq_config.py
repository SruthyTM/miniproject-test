#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
from app.ai_agent import score_creative_text_with_ai

load_dotenv()

def check_groq_config():
    print("=== GROQ API Configuration Check ===")
    
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("❌ GROQ_API_KEY: MISSING")
        return False
    elif api_key.startswith("your_"):
        print("❌ GROQ_API_KEY: NOT CONFIGURED")
        return False
    else:
        print(f"✅ GROQ_API_KEY: {'*' * len(api_key)}")
        return True

def test_groq_api():
    print("\n=== Testing GROQ API ===")
    
    test_text = "I deserve this prize because my innovative solution combines cutting-edge technology with user-centered design to create meaningful impact."
    
    try:
        result = score_creative_text_with_ai(test_text)
        print(f"✅ GROQ API working!")
        print(f"Score: {result.get('score')}")
        print(f"Sentiment: {result.get('sentiment')}")
        return True
    except Exception as e:
        print(f"❌ GROQ API Error: {e}")
        return False

def show_fix_instructions():
    print("\n=== Fix Instructions ===")
    print("1. Get GROQ API Key from: https://console.groq.com/")
    print("2. Add to .env file: GROQ_API_KEY=your_actual_api_key")
    print("3. Restart backend server")

def main():
    if check_groq_config():
        test_groq_api()
    else:
        show_fix_instructions()

if __name__ == "__main__":
    main()
