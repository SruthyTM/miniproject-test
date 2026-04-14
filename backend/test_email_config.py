#!/usr/bin/env python3

import sys
import os
import asyncio
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.email_utils import send_otp_email
from dotenv import load_dotenv

load_dotenv()

def check_env_vars():
    print("=== Email Configuration Check ===")
    
    required_vars = [
        'MAIL_USERNAME', 'MAIL_PASSWORD', 'MAIL_FROM', 
        'MAIL_PORT', 'MAIL_SERVER', 'MAIL_STARTTLS',
        'MAIL_SSL_TLS', 'USE_CREDENTIALS', 'VALIDATE_CERTS'
    ]
    
    missing_vars = []
    for var in required_vars:
        value = os.getenv(var)
        if not value or value == f"your-{var.lower().replace('_', '-')}":
            missing_vars.append(var)
        else:
            if 'PASSWORD' in var:
                print(f"✅ {var}: {'*' * len(value)}")
            else:
                print(f"✅ {var}: {value}")
    
    if missing_vars:
        print(f"\n❌ Missing or not configured: {missing_vars}")
        return False
    else:
        print("\n✅ All email variables are configured")
        return True

async def test_email_sending():
    print("\n=== Testing Email Sending ===")
    
    test_email = "sruthyymuraleedharan@gmail.com"
    test_otp = "123456"
    
    try:
        result = await send_otp_email(test_email, test_otp)
        if result:
            print(f"✅ Email sent successfully to {test_email}")
            print("Check your inbox (and spam folder)")
        else:
            print("❌ Email sending failed")
    except Exception as e:
        print(f"❌ Error sending email: {e}")
        import traceback
        traceback.print_exc()

def main():
    if check_env_vars():
        print("\n📧 Testing email configuration...")
        asyncio.run(test_email_sending())
    else:
        print("\n❌ Please configure email variables in .env file first")
        print("\nExample configuration:")
        print("MAIL_USERNAME=your-email@gmail.com")
        print("MAIL_PASSWORD=your-app-password")
        print("MAIL_FROM=your-email@gmail.com")
        print("MAIL_PORT=587")
        print("MAIL_SERVER=smtp.gmail.com")

if __name__ == "__main__":
    main()
