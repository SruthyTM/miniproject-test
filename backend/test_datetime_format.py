#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime
import random

def test_datetime_format():
    print("=== Testing DateTime Format ===")
    
    # Test the exact same code as in the endpoint
    session_submitted_at = datetime.utcnow()
    
    try:
        formatted_date = session_submitted_at.strftime("%d %b %Y, %H:%M UTC")
        print(f"✅ DateTime format successful: {formatted_date}")
        return True
    except Exception as e:
        print(f"❌ DateTime format failed: {e}")
        return False

if __name__ == "__main__":
    test_datetime_format()
