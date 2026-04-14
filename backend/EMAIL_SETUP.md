# Email OTP Verification Setup

The OTP email verification requires SMTP configuration to send emails. Follow these steps:

## Option 1: Gmail (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" for the app
   - Select "Other (Custom name)" and enter "Quiz App"
   - Copy the 16-character password (this is what you'll use)

3. **Create .env file**
   ```bash
   cd backend
   cp .env.example .env
   ```

4. **Edit .env file** and add your Gmail settings:
   ```
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-16-character-app-password
   MAIL_FROM=your-email@gmail.com
   MAIL_PORT=587
   MAIL_SERVER=smtp.gmail.com
   MAIL_FROM_NAME=Quiz App
   MAIL_STARTTLS=True
   MAIL_SSL_TLS=False
   USE_CREDENTIALS=True
   VALIDATE_CERTS=True
   ```

## Option 2: Outlook/Hotmail

1. Create .env file as above
2. Add your Outlook settings:
   ```
   MAIL_USERNAME=your-email@outlook.com
   MAIL_PASSWORD=your-password
   MAIL_FROM=your-email@outlook.com
   MAIL_PORT=587
   MAIL_SERVER=smtp-mail.outlook.com
   ```

## Option 3: Mailtrap (Development Testing)

1. Sign up for free at: https://mailtrap.io
2. Create a new inbox
3. Copy the SMTP credentials
4. Add to .env:
   ```
   MAIL_USERNAME=your-mailtrap-username
   MAIL_PASSWORD=your-mailtrap-password
   MAIL_FROM=from@example.com
   MAIL_PORT=2525
   MAIL_SERVER=smtp.mailtrap.io
   ```

## After Setup

1. Restart the backend server:
   ```bash
   cd backend
   .venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

2. Test by registering a new user - you should receive an OTP email

## Troubleshooting

- **"Invalid credentials"**: Double-check your email/password
- **"Connection refused"**: Check firewall/antivirus blocking port 587
- **Gmail issues**: Make sure you're using an App Password, not your regular password
- **No email received**: Check spam folder

## Development OTP

For development, the system always uses OTP "123456" as shown in security.py:
```python
def generate_verification_code() -> str:
    # Dev OTP requested by product flow.
    return "123456"
```

So you can always use "123456" to verify emails during development.
