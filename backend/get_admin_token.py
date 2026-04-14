#!/usr/bin/env python3
"""
Get admin token for testing
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import User
from app.security import verify_password, generate_token

def get_admin_token():
    """Get admin token for testing"""
    db = SessionLocal()
    try:
        # Get admin user
        admin_user = db.query(User).filter(User.email == "sruthy.m@thinkpalm.com").first()
        if not admin_user:
            print("Admin user not found!")
            return
        
        print(f"Admin user found: {admin_user.email}")
        print(f"Password hash: {admin_user.password_hash}")
        
        # Create token (using default password "123456")
        if verify_password("123456", admin_user.password_hash):
            token = generate_token()
            print(f"Admin token: {token}")
            return token
        else:
            print("Password verification failed!")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    get_admin_token()
