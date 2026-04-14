#!/usr/bin/env python3
"""
Test the improved scoring system
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.ai_agent import get_fallback_score

def test_improved_scoring():
    """Test improved scoring with sample text"""
    test_text = "Encouraging innovation, continuous learning, and collaboration while adopting modern technologies and streamlined processes can drive organizational growth, enhance productivity, and build a strong, future-ready workforce."
    
    print(f"Testing text: {test_text}")
    print(f"Word count: {len(test_text.split())}")
    print(f"Improved score: {get_fallback_score(test_text)}/10")
    
    # Test other examples
    test_cases = [
        ("I love this amazing opportunity!", 25, "Expected: 7-8"),
        ("This is terrible and awful", 22, "Expected: 3-4"),
        ("The system process is working", 24, "Expected: 6"),
        ("Great innovation and growth", 24, "Expected: 7-8"),
        ("Poor performance", 18, "Expected: 3-4"),
        ("Too short text", 8, "Expected: 3-4"),
        ("Very long text that goes on and on about many different topics without much substance", 20, "Expected: 4-6")
    ]
    
    print("\nTest cases:")
    for text, expected_range, expected in test_cases:
        result = get_fallback_score(text)
        status = "✅" if expected_range[0] <= result <= expected_range[1] else "❌"
        print(f"  {status} Score: {result}/10 (Expected: {expected_range[0]}-{expected_range[1]})")

if __name__ == "__main__":
    test_improved_scoring()
