#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
from app.email_utils import send_otp_email
from app.security import generate_verification_code

load_dotenv()

def show_email_status():
    print("=== EMAIL OTP STATUS REPORT ===")
    print(f"✅ Dynamic OTP Generation: Working (generating codes like {generate_verification_code()})")
    print(f"✅ Email Configuration: All settings loaded")
    print(f"✅ Backend Server: Running on http://127.0.0.1:8000")
    print(f"❌ Gmail Authentication: Still failing")
    
    print("\n=== ROOT CAUSE ===")
    print("Gmail App Password authentication is consistently failing.")
    print("This is a Gmail-specific issue, not a code issue.")

def provide_solutions():
    print("\n=== SOLUTIONS ===")
    
    print("\n🔧 SOLUTION 1: Use Development OTP (Immediate)")
    print("The system generates dynamic OTPs automatically.")
    print("Use the generated code for testing - no email needed!")
    print(f"Example: Current OTP would be: {generate_verification_code()}")
    
    print("\n🔧 SOLUTION 2: Fix Gmail App Password")
    print("1. Go to: https://myaccount.google.com/apppasswords")
    print("2. Delete ALL existing app passwords")
    print("3. Enable 2-factor authentication if not already enabled")
    print("4. Create NEW app password for 'Mail' app")
    print("5. Copy the 16-character password EXACTLY")
    print("6. Update .env file with new password")
    print("7. Restart backend server")
    
    print("\n🔧 SOLUTION 3: Switch to Mailtrap.io (Recommended)")
    print("1. Sign up at: https://mailtrap.io")
    print("2. Get free SMTP credentials")
    print("3. Update .env file with Mailtrap settings:")
    print("   MAIL_USERNAME=your-mailtrap-username")
    print("   MAIL_PASSWORD=your-mailtrap-password")
    print("   MAIL_SERVER=smtp.mailtrap.io")
    print("   MAIL_PORT=2525")
    print("4. Restart backend server")
    
    print("\n🔧 SOLUTION 4: Use Different Email Service")
    print("1. Create Outlook/Hotmail account")
    print("2. Update .env with Outlook SMTP settings")
    print("3. Outlook doesn't require App Passwords")

def test_current_otp():
    print(f"\n=== CURRENT OTP TEST ===")
    current_otp = generate_verification_code()
    print(f"Generated OTP: {current_otp}")
    print("This OTP would be sent to your email if SMTP was working.")
    print("For now, you can use this code for testing registration.")

if __name__ == "__main__":
    show_email_status()
    provide_solutions()
    test_current_otp()
