#!/usr/bin/env python3
"""
Test the fallback scoring function
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.ai_agent import get_fallback_score

def test_fallback_scoring():
    """Test the fallback scoring with sample texts"""
    
    test_texts = [
        "Encouraging innovation, continuous learning, and collaboration while adopting modern technologies and streamlined processes can drive organizational growth, enhance productivity, and build a strong, future-ready workforce.",
        "I love cars and want to win this amazing prize because it would change my life completely.",
        "Short text.",
        "This is exactly twenty five words long submission for the creative contest that I am participating in right now.",
        "Amazing wonderful fantastic excellent great innovation growth collaboration learning future fantastic amazing wonderful great excellent innovation growth collaboration learning future wonderful"
    ]
    
    print("Testing fallback scoring function:")
    print("=" * 50)
    
    for i, text in enumerate(test_texts, 1):
        score = get_fallback_score(text)
        word_count = len(text.split())
        print(f"Test {i}:")
        print(f"  Words: {word_count}")
        print(f"  Score: {score}/10")
        print(f"  Text: {text[:60]}...")
        print()

if __name__ == "__main__":
    test_fallback_scoring()
