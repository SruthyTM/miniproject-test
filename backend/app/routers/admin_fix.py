from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import QuizSession
from ..deps import current_user
from ..ai_agent import get_fallback_score

router = APIRouter(prefix="/admin/fix", tags=["admin-fix"])

@router.post("/zero-scores")
def fix_zero_scores(db: Session = Depends(get_db), user=Depends(current_user)):
    """Update all sessions with ai_score of 0 to use fallback scoring"""
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Not an admin")
    
    # Find all sessions with creative text but ai_score of 0
    sessions = db.query(QuizSession).filter(
        QuizSession.creative_text.isnot(None),
        QuizSession.ai_score == 0
    ).all()
    
    updated_count = 0
    
    for session in sessions:
        fallback_score = get_fallback_score(session.creative_text)
        session.ai_score = fallback_score
        session.ai_sentiment = session.ai_sentiment or "Neutral"
        updated_count += 1
    
    db.commit()
    
    return {
        "message": f"Successfully updated {updated_count} sessions",
        "updated_count": updated_count
    }
