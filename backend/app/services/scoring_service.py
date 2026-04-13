from fastapi import HTTPException
from sqlalchemy.orm import Session

from .. import models
from ..ai_agent.evaluator import evaluate_answer


MAX_WORDS = 25


def validate_answer_word_count(answer: str):
    word_count = len(answer.split())
    if word_count == 0:
        raise HTTPException(status_code=400, detail="Answer cannot be empty")
    if word_count > MAX_WORDS:
        raise HTTPException(status_code=400, detail="Answer must be 25 words or fewer")


def get_latest_quiz_score(db: Session, user_id: int) -> int:
    latest_session = (
        db.query(models.QuizSession)
        .filter(models.QuizSession.user_id == user_id, models.QuizSession.completed.is_(True))
        .order_by(models.QuizSession.started_at.desc())
        .first()
    )
    if not latest_session:
        raise HTTPException(status_code=400, detail="No completed quiz found for this user")
    return latest_session.score


def score_submission(answer: str, quiz_score: int) -> dict:
    ai_result = evaluate_answer(answer)
    ai_score = ai_result["score"]
    total_score = quiz_score + ai_score
    return {
        "ai_score": ai_score,
        "feedback": ai_result["feedback"],
        "total_score": total_score,
    }
