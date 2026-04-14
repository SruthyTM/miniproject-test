#!/usr/bin/env python3

import sys
import os
import asyncio
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.email_utils import send_otp_email
from app.security import generate_verification_code
from dotenv import load_dotenv

load_dotenv()

def show_current_config():
    print("=== Current SMTP Configuration ===")
    config_vars = {
        'MAIL_USERNAME': os.getenv('MAIL_USERNAME'),
        'MAIL_PASSWORD': os.getenv('MAIL_PASSWORD'),
        'MAIL_FROM': os.getenv('MAIL_FROM'),
        'MAIL_PORT': os.getenv('MAIL_PORT'),
        'MAIL_SERVER': os.getenv('MAIL_SERVER'),
        'MAIL_STARTTLS': os.getenv('MAIL_STARTTLS'),
        'MAIL_SSL_TLS': os.getenv('MAIL_SSL_TLS'),
        'USE_CREDENTIALS': os.getenv('USE_CREDENTIALS'),
        'VALIDATE_CERTS': os.getenv('VALIDATE_CERTS')
    }
    
    issues = []
    for key, value in config_vars.items():
        if not value:
            issues.append(f"{key}: MISSING")
        elif 'PASSWORD' in key and value.startswith('your-'):
            issues.append(f"{key}: NOT CONFIGURED")
        elif 'EMAIL' in key and value.startswith('your_'):
            issues.append(f"{key}: NOT CONFIGURED")
        else:
            if 'PASSWORD' in key:
                print(f"✅ {key}: {'*' * len(value)}")
            else:
                print(f"✅ {key}: {value}")
    
    return issues

async def test_smtp_connection():
    print("\n=== Testing SMTP Connection ===")
    
    # Generate a real OTP
    otp = generate_verification_code()
    test_email = "sruthyymuraleedharan@gmail.com"
    
    print(f"Generated OTP: {otp}")
    print(f"Sending to: {test_email}")
    
    try:
        result = await send_otp_email(test_email, otp)
        if result:
            print("✅ Email sent successfully!")
            print("Check your inbox (including spam folder)")
            return True
        else:
            print("❌ Email sending failed")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def show_fix_instructions():
    print("\n=== Fix Instructions ===")
    print("To fix SMTP issues, update your .env file:")
    print("\n1. Fix MAIL_FROM to match your username:")
    print("   MAIL_FROM=sruthy.m@thinkpalm.com")
    print("\n2. Generate Gmail App Password:")
    print("   - Go to: https://myaccount.google.com/apppasswords")
    print("   - Enable 2-factor authentication")
    print("   - Create App Password for 'Mail' app")
    print("   - Use the 16-character password")
    print("\n3. Update MAIL_PASSWORD with App Password")
    print("   MAIL_PASSWORD=your-16-character-app-password")

async def main():
    issues = show_current_config()
    
    if issues:
        print(f"\n❌ Configuration Issues: {len(issues)}")
        for issue in issues:
            print(f"   - {issue}")
        show_fix_instructions()
    else:
        print("\n✅ Configuration looks good")
        await test_smtp_connection()

if __name__ == "__main__":
    asyncio.run(main())
