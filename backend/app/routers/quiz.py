from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..deps import current_user
from ..questions import QUIZ_QUESTIONS

router = APIRouter(prefix="/quiz", tags=["quiz"])

TOTAL_QUESTIONS = 15
QUIZ_DURATION_SECONDS = 300


def has_timed_out(session: models.QuizSession) -> bool:
    end_time = session.started_at + timedelta(seconds=session.duration_seconds)
    return datetime.utcnow() > end_time


def public_question(index: int):
    q = QUIZ_QUESTIONS[index]
    return {"id": q["id"], "question": q["question"], "options": q["options"]}


@router.post("/start", response_model=schemas.StartQuizResponse)
def start_quiz(db: Session = Depends(get_db), user=Depends(current_user)):
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
    if session.completed:
        return {"completed": True, "timed_out": session.timed_out}

    if has_timed_out(session):
        session.completed = True
        session.timed_out = True
        db.commit()
        return {"completed": True, "timed_out": True}

    current_q = QUIZ_QUESTIONS[session.current_index]
    if payload.answer_index == current_q["answer"]:
        session.score += 1

    session.current_index += 1

    if session.current_index >= TOTAL_QUESTIONS:
        session.completed = True
        if session.score > user.best_score:
            user.best_score = session.score
        db.commit()
        return {"completed": True, "timed_out": False}

    db.commit()
    return {
        "completed": False,
        "timed_out": False,
        "next_index": session.current_index,
        "next_question": public_question(session.current_index),
    }


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


@router.get("/{session_id}/result", response_model=schemas.QuizResultResponse)
def quiz_result(session_id: int, db: Session = Depends(get_db), user=Depends(current_user)):
    session = (
        db.query(models.QuizSession)
        .filter(models.QuizSession.id == session_id, models.QuizSession.user_id == user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Quiz session not found")
    if not session.completed:
        raise HTTPException(status_code=400, detail="Quiz not completed yet")

    ranking_users = db.query(models.User).order_by(models.User.best_score.desc()).limit(50).all()
    ranking = [
        {"email": u.email, "score": u.best_score, "rank": i + 1}
        for i, u in enumerate(ranking_users)
    ]

    return {"score": session.score, "total_questions": TOTAL_QUESTIONS, "ranking": ranking}
