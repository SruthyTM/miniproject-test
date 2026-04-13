from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..deps import current_user
from ..services.scoring_service import (
    get_latest_quiz_score,
    score_submission,
    validate_answer_word_count,
)

router = APIRouter(tags=["final-answer"])


@router.post("/submit-final-answer", response_model=schemas.FinalAnswerSubmitResponse)
def submit_final_answer(
    payload: schemas.FinalAnswerSubmitRequest,
    db: Session = Depends(get_db),
    user=Depends(current_user),
):
    if payload.userId not in {str(user.id), user.email}:
        raise HTTPException(status_code=403, detail="userId does not match authenticated user")

    answer = payload.answer.strip()
    validate_answer_word_count(answer)
    quiz_score = get_latest_quiz_score(db, user.id)
    scored = score_submission(answer, quiz_score)

    submission = models.Submission(
        user_id=user.id,
        answer=answer,
        ai_score=scored["ai_score"],
        total_score=scored["total_score"],
    )
    db.add(submission)
    db.commit()

    return scored


@router.get("/leaderboard", response_model=schemas.LeaderboardResponse)
def leaderboard(db: Session = Depends(get_db)):
    top_rows = (
        db.query(
            models.User.id.label("user_id"),
            models.User.email.label("email"),
            func.max(models.Submission.total_score).label("best_total_score"),
        )
        .join(models.Submission, models.User.id == models.Submission.user_id)
        .group_by(models.User.id, models.User.email)
        .order_by(func.max(models.Submission.total_score).desc())
        .limit(10)
        .all()
    )

    board = [
        {
            "user_id": row.user_id,
            "name": row.email.split("@")[0],
            "total_score": row.best_total_score,
        }
        for row in top_rows
    ]
    return {"leaderboard": board}
