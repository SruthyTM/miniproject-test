from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from .. import models, schemas
from ..database import get_db
from ..deps import current_user

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/sessions", response_model=list[schemas.AdminSessionEntry])
def get_all_sessions(db: Session = Depends(get_db), user=Depends(current_user)):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Not an admin")
    
    sessions = db.query(models.QuizSession).join(models.User).filter(models.QuizSession.completed == True).all()
    
    result = []
    for s in sessions:
        result.append({
            "id": s.id,
            "email": s.user.email,
            "score": s.score,
            "creative_text": s.creative_text,
            "is_shortlisted": s.is_shortlisted,
            "entry_reference": s.entry_reference,
            "submitted_at": s.submitted_at
        })
    return result

@router.post("/sessions/{session_id}/shortlist")
def toggle_shortlist(session_id: int, db: Session = Depends(get_db), user=Depends(current_user)):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Not an admin")
    
    session = db.query(models.QuizSession).filter(models.QuizSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session.is_shortlisted = not session.is_shortlisted
    db.commit()
    return {"is_shortlisted": session.is_shortlisted}

@router.get("/dashboard", response_model=schemas.DashboardResponse)
def get_user_dashboard(db: Session = Depends(get_db), user=Depends(current_user)):
    sessions = db.query(models.QuizSession).filter(models.QuizSession.user_id == user.id).all()
    
    entries_used = len(sessions)
    slots_left = max(10 - entries_used, 0)
    
    shortlisted_session = next((s for s in sessions if s.is_shortlisted), None)
    
    # Competition close time (using system config or fallback)
    config = db.query(models.SystemConfig).filter_by(key="challenge_end_time").first()
    if config:
        end_date = datetime.fromisoformat(config.value)
    else:
        end_date = datetime.utcnow() + timedelta(days=89) # Fallback as in screenshot
        
    remaining = int((end_date - datetime.utcnow()).total_seconds())
    
    return {
        "entries_used": entries_used,
        "slots_left": slots_left,
        "shortlisted_count": 1 if shortlisted_session else 0,
        "is_shortlisted": shortlisted_session is not None,
        "entry_reference": shortlisted_session.entry_reference if shortlisted_session else None,
        "competition_close_seconds": max(remaining, 0)
    }
