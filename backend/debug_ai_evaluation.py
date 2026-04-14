#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.ai_agent import score_creative_text_with_ai

def debug_ai_evaluation():
    print("=== Debugging AI Evaluation ===")
    
    test_text = "one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty twenty-one twenty-two twenty-three twenty-four twenty-five"
    
    print(f"Test text: {test_text}")
    print(f"Word count: {len(test_text.strip().split())}")
    
    try:
        print("Testing AI evaluation...")
        result = score_creative_text_with_ai(test_text)
        print(f"✅ AI evaluation successful: {result}")
        return True
    except Exception as e:
        print(f"❌ AI evaluation failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    debug_ai_evaluation()
