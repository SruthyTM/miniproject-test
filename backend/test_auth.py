#!/usr/bin/env python3
"""
Test authentication flow
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import User, AuthToken
from app.security import verify_password, generate_token

def test_auth():
    """Test authentication flow"""
    db = SessionLocal()
    try:
        # Get admin user
        admin_user = db.query(User).filter(User.email == "sruthy.m@thinkpalm.com").first()
        if not admin_user:
            print("Admin user not found!")
            return
        
        print(f"Admin user found: {admin_user.email}")
        print(f"Is admin: {admin_user.is_admin}")
        print(f"Is verified: {admin_user.is_verified}")
        
        # Verify password
        if verify_password("123456", admin_user.password_hash):
            print("Password verified!")
            
            # Generate token
            token = generate_token()
            print(f"Generated token: {token}")
            
            # Store token in database
            token_row = AuthToken(token=token, user_id=admin_user.id)
            db.add(token_row)
            db.commit()
            print("Token stored in database!")
            
            # Test token retrieval
            stored_token = db.query(AuthToken).filter(AuthToken.token == token).first()
            if stored_token:
                print(f"Token found in DB: {stored_token.token}")
                print(f"User ID: {stored_token.user_id}")
            else:
                print("Token not found in DB!")
                
        else:
            print("Password verification failed!")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_auth()
