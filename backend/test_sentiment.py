#!/usr/bin/env python3
"""
Test the improved sentiment analysis
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.ai_agent import get_fallback_sentiment

def test_sentiment():
    """Test sentiment analysis with sample text"""
    test_text = "Encouraging innovation, continuous learning, and collaboration while adopting modern technologies and streamlined processes can drive organizational growth, enhance productivity, and build a strong, future-ready workforce."
    
    print(f"Testing text: {test_text}")
    print(f"Sentiment: {get_fallback_sentiment(test_text)}")
    
    # Test other examples
    test_cases = [
        ("I love this amazing opportunity!", "Expected: Positive"),
        ("This is terrible and awful", "Expected: Negative"),
        ("The system process is working", "Expected: Neutral"),
        ("Great innovation and growth", "Expected: Positive"),
        ("Poor performance", "Expected: Negative")
    ]
    
    print("\nTest cases:")
    for text, expected in test_cases:
        result = get_fallback_sentiment(text)
        status = "✅" if result == expected.split(": ")[1] else "❌"
        print(f"  {status} '{text}' -> {result} ({expected})")

if __name__ == "__main__":
    test_sentiment()
