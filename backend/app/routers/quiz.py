import random
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..deps import current_user
from ..questions import QUIZ_QUESTIONS
from ..ai_agent import verify_answer_with_ai, score_creative_text_with_ai

router = APIRouter(prefix="/quiz", tags=["quiz"])

TOTAL_QUESTIONS = 20
QUIZ_DURATION_SECONDS = 3600 # 1 hour total (let frontend handle 20s per question)
MAX_ATTEMPTS = 10


def has_timed_out(session: models.QuizSession) -> bool:
    end_time = session.started_at + timedelta(seconds=session.duration_seconds)
    return datetime.utcnow() > end_time


def public_question(index: int):
    q = QUIZ_QUESTIONS[index]
    return {"id": q["id"], "question": q["question"], "options": q["options"], "correct_answer": q["answer"]}


@router.get("/challenge-time")
def get_challenge_time(db: Session = Depends(get_db)):
    config = db.query(models.SystemConfig).filter_by(key="challenge_end_time").first()
    if not config:
        end_date = datetime.utcnow() + timedelta(hours=66)
        config = models.SystemConfig(key="challenge_end_time", value=end_date.isoformat())
        db.add(config)
        db.commit()
    end_date = datetime.fromisoformat(config.value)
    remaining = (end_date - datetime.utcnow()).total_seconds()
    return {"remaining_seconds": max(int(remaining), 0)}


@router.post("/start", response_model=schemas.StartQuizResponse)
def start_quiz(db: Session = Depends(get_db), user=Depends(current_user)):
    # Check attempts
    attempts = db.query(models.QuizSession).filter(models.QuizSession.user_id == user.id).count()
    if attempts >= MAX_ATTEMPTS:
        raise HTTPException(status_code=403, detail=f"Maximum of {MAX_ATTEMPTS} attempts allowed.")

    session = models.QuizSession(
        user_id=user.id, current_index=0, score=0, duration_seconds=QUIZ_DURATION_SECONDS
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    return {
        "session_id": session.id,
        "total_questions": TOTAL_QUESTIONS,
        "total_duration_seconds": QUIZ_DURATION_SECONDS,
        "current_question": public_question(0),
        "current_index": 0,
    }


@router.post("/{session_id}/answer", response_model=schemas.SubmitAnswerResponse)
def submit_answer(
    session_id: int,
    payload: schemas.SubmitAnswerRequest,
    db: Session = Depends(get_db),
    user=Depends(current_user),
):
    session = (
        db.query(models.QuizSession)
        .filter(models.QuizSession.id == session_id, models.QuizSession.user_id == user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Quiz session not found")
    
    # Auto-check for timeout and apply penalty if needed
    if has_timed_out(session) and not session.completed:
        session.completed = True
        session.timed_out = True
        user.penalty_attempts += 1
        db.commit()
        return {"completed": True, "timed_out": True, "correct": False, "penalty_applied": True}
    
    if session.completed:
        return {"completed": True, "timed_out": session.timed_out, "correct": True}

    current_q = QUIZ_QUESTIONS[session.current_index]
    # Attempt AI verification first
    ai_result = verify_answer_with_ai(current_q["question"], current_q["options"], payload.answer_index)
    
    if ai_result is not None:
        is_correct = ai_result
    else:
        # Fallback to hardcoded comparison
        is_correct = payload.answer_index == current_q["answer"]
    
    if is_correct:
        session.score += 1
        session.current_index += 1
        
        if session.current_index >= TOTAL_QUESTIONS:
            session.completed = True
            if session.score > user.best_score:
                user.best_score = session.score
            db.commit()
            return {"completed": True, "timed_out": False, "correct": True}
        
        db.commit()
        return {
            "completed": False,
            "timed_out": False,
            "correct": True,
            "next_index": session.current_index,
            "next_question": public_question(session.current_index),
        }
    else:
        # WRONG ANSWER - 100% required, so end session immediately
        session.completed = True
        # Apply penalty for wrong answer
        user.penalty_attempts += 1
        if session.score > user.best_score:
            user.best_score = session.score
        db.commit()
        return {"completed": True, "timed_out": False, "correct": False, "penalty_applied": True}


@router.get("/{session_id}/remaining-seconds")
def remaining_seconds(session_id: int, db: Session = Depends(get_db), user=Depends(current_user)):
    session = (
        db.query(models.QuizSession)
        .filter(models.QuizSession.id == session_id, models.QuizSession.user_id == user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Quiz session not found")
    end_time = session.started_at + timedelta(seconds=session.duration_seconds)
    remaining = int((end_time - datetime.utcnow()).total_seconds())
    return {"remaining_seconds": max(remaining, 0)}


@router.post("/{session_id}/timeout")
def handle_timeout(session_id: int, db: Session = Depends(get_db), user=Depends(current_user)):
    session = (
        db.query(models.QuizSession)
        .filter(models.QuizSession.id == session_id, models.QuizSession.user_id == user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Quiz session not found")
    
    if session.completed:
        return {"completed": True, "timed_out": session.timed_out, "penalty_applied": False}
    
    # Apply timeout penalty
    session.completed = True
    session.timed_out = True
    user.penalty_attempts += 1
    db.commit()
    
    return {
        "completed": True, 
        "timed_out": True, 
        "correct": False, 
        "penalty_applied": True,
        "penalty_attempts": user.penalty_attempts
    }


@router.get("/{session_id}/result", response_model=schemas.QuizResultResponse)
def quiz_result(session_id: int, db: Session = Depends(get_db), user=Depends(current_user)):
    session = (
        db.query(models.QuizSession)
        .filter(models.QuizSession.id == session_id, models.QuizSession.user_id == user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Quiz session not found")
    
    # Auto-check for timeout and apply penalty if needed
    if has_timed_out(session) and not session.completed:
        session.completed = True
        session.timed_out = True
        user.penalty_attempts += 1
        db.commit()
    
    if not session.completed:
        raise HTTPException(status_code=400, detail="Quiz not completed yet")

    # Get attempt count for the UI
    attempts_count = db.query(models.QuizSession).filter(models.QuizSession.user_id == user.id).count()

    ranking_users = db.query(models.User).order_by(models.User.best_score.desc()).limit(50).all()
    ranking = [
        {"email": u.email, "score": u.best_score, "rank": i + 1}
        for i, u in enumerate(ranking_users)
    ]

    return {"score": session.score, "total_questions": TOTAL_QUESTIONS, "ranking": ranking, "attempts_count": attempts_count}

@router.post("/{session_id}/creative", response_model=schemas.CreativeSubmitResponse)
def submit_creative(session_id: int, payload: schemas.CreativeSubmitRequest, db: Session = Depends(get_db), user=Depends(current_user)):
    session = db.query(models.QuizSession).filter(models.QuizSession.id == session_id, models.QuizSession.user_id == user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # 25 words check
    words = payload.text.strip().split()
    if len(words) != 25:
        raise HTTPException(
            status_code=400, detail="Submission must be exactly 25 words."
        )

    # Use AI Agent to evaluate creative text!
    print(f"Starting AI evaluation for session {session.id}")
    ai_eval = score_creative_text_with_ai(payload.text)
    print(f"AI evaluation completed: {ai_eval}")
    
    session.creative_text = payload.text
    session.ai_score = ai_eval.get("score", 5)
    session.ai_sentiment = ai_eval.get("sentiment", "Neutral")
    
    print(f"Session {session.id} updated - AI Score: {session.ai_score}, AI Sentiment: {session.ai_sentiment}")
    
    # Generate reference and timestamp
    session.entry_reference = f"TBSC-{datetime.utcnow().strftime('%Y')}-{random.randint(100000, 999999)}"
    session.submitted_at = datetime.utcnow()
    
    db.commit()
    
    return {
        "entry_reference": session.entry_reference,
        "submitted_at": session.submitted_at.strftime("%d %b %Y, %H:%M UTC")
    }
