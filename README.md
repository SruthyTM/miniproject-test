# Full-Stack Quiz Flow App

This project includes:

- `frontend/` - React Native (Expo) app
- `backend/` - Python FastAPI backend

## Features Implemented

- Registration + login
- Email verification requirement before login
- Eligibility MCQ with checkbox-like selection
- Timed 15-question quiz (question-by-question flow)
- Timeout handling
- Result page with marks and user ranking
- Guided step-by-step user flow and state transitions

## Run Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Run Frontend

```bash
cd frontend
npm install
npm start
```

## Backend Notes

- Verification email is mocked for development.
- Registration response includes a `verification_code` so you can test verification quickly.
- In production, replace this with real email sending.
