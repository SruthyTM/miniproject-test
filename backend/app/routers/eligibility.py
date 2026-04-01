from fastapi import APIRouter, Depends

from ..deps import current_user
from ..questions import ELIGIBILITY_QUESTIONS

router = APIRouter(prefix="/eligibility", tags=["eligibility"])


@router.get("/questions")
def get_eligibility_questions(user=Depends(current_user)):
    _ = user
    return [
        {"id": q["id"], "text": q["text"], "options": q["options"]}
        for q in ELIGIBILITY_QUESTIONS
    ]


@router.post("/submit")
def submit_eligibility(answers: dict, user=Depends(current_user)):
    _ = (answers, user)
    return {"eligible": True, "message": "Eligibility submitted"}
