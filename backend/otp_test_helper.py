#!/usr/bin/env python3

import sys
import os
import asyncio
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import User
from app.security import hash_password, generate_verification_code

def get_dev_otp():
    """Get the development OTP for any email"""
    return "123456"  # This is hardcoded in security.py

def create_test_user_and_get_otp():
    """Create a test user and show how to get OTP"""
    db = SessionLocal()
    try:
        test_email = "sruthyymuraleedharan@gmail.com"
        
        # Check if user exists
        user = db.query(User).filter(User.email == test_email).first()
        if user:
            print(f"User {test_email} already exists")
            print(f"Verification code: {user.verification_code}")
            print(f"Is verified: {user.is_verified}")
        else:
            print(f"User {test_email} doesn't exist. Registering...")
            
            # Create user
            user = User(
                email=test_email,
                password_hash=hash_password("test123"),
                is_verified=False,
                verification_code=generate_verification_code()
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
            print(f"User created successfully!")
            print(f"Email: {user.email}")
            print(f"Verification code: {user.verification_code}")
            print(f"Is verified: {user.is_verified}")
        
        print(f"\n🔢 Use this OTP for verification: {user.verification_code}")
        print(f"💡 Development OTP is always: {get_dev_otp()}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

def show_otp_testing_guide():
    print("=== OTP Testing Guide ===")
    print("1. Development OTP is always: 123456")
    print("2. For any email registration, use: 123456")
    print("3. Email sending is failing due to Gmail auth issues")
    print("4. You can test registration without working emails")
    print("\n=== Steps to Test Registration ===")
    print("1. Register with any email")
    print("2. Enter OTP: 123456")
    print("3. Account will be verified")
    print("\n=== To Fix Email Issues ===")
    print("1. Update MAIL_FROM in .env to match MAIL_USERNAME")
    print("2. Generate Gmail App Password (not regular password)")
    print("3. Enable 2-factor authentication on Gmail")

if __name__ == "__main__":
    show_otp_testing_guide()
    print("\n" + "="*50)
    create_test_user_and_get_otp()
