#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def check_quiz_imports():
    print("=== Checking Quiz Router Imports ===")
    
    try:
        from app.routers.quiz import router
        print("Quiz router import: OK")
    except Exception as e:
        print(f"Quiz router import failed: {e}")
    
    try:
        from app.routers.quiz import submit_creative
        print("submit_creative function import: OK")
    except Exception as e:
        print(f"submit_creative function import failed: {e}")
    
    try:
        from app.ai_agent import score_creative_text_with_ai
        print("AI agent import: OK")
    except Exception as e:
        print(f"AI agent import failed: {e}")
    
    try:
        from app.schemas import CreativeSubmitRequest, CreativeSubmitResponse
        print("Creative schemas import: OK")
    except Exception as e:
        print(f"Creative schemas import failed: {e}")
    
    try:
        from app.models import QuizSession
        print("QuizSession model import: OK")
    except Exception as e:
        print(f"QuizSession model import failed: {e}")

if __name__ == "__main__":
    check_quiz_imports()
