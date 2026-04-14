#!/usr/bin/env python3
"""
Test scoring system
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.ai_agent import get_fallback_score

def test_score():
    """Test scoring with sample text"""
    test_text = "Encouraging innovation, continuous learning, and collaboration while adopting modern technologies and streamlined processes can drive organizational growth, enhance productivity, and build a strong, future-ready workforce."
    
    print(f"Testing text: {test_text}")
    score = get_fallback_score(test_text)
    print(f"Score: {score}/10")

if __name__ == "__main__":
    test_score()
