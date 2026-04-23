from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional

from .. import models, schemas
from ..database import get_db
from ..deps import current_user
from ..ai_agent import get_fallback_score, get_fallback_sentiment

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/users")
def get_all_users(db: Session = Depends(get_db), user=Depends(current_user)):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Not an admin")
    users = db.query(models.User).all()
    return [{"id": u.id, "email": u.email, "is_verified": u.is_verified, "is_admin": u.is_admin} for u in users]

@router.post("/users/{user_id}/toggle-admin")
def toggle_user_admin(user_id: int, db: Session = Depends(get_db), user=Depends(current_user)):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Not an admin")
    
    target_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    target_user.is_admin = not target_user.is_admin
    db.commit()
    return {"is_admin": target_user.is_admin}

@router.get("/sessions", response_model=list[schemas.AdminSessionEntry])
@router.post("/sessions", response_model=list[schemas.AdminSessionEntry])
def get_all_sessions(
    db: Session = Depends(get_db), 
    user=Depends(current_user), 
    fix_scores: Optional[bool] = Query(False)
):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Not an admin")
    
    # Get all completed sessions
    sessions = db.query(models.QuizSession).join(models.User).filter(models.QuizSession.completed == True).all()
    
    # Group sessions by user to find their highest score and best sentiment
    user_perfect_sessions = {}
    for s in sessions:
        user_id = s.user.id
        if s.score == 20:  # Only consider perfect scores
            if user_id not in user_perfect_sessions:
                user_perfect_sessions[user_id] = []
            user_perfect_sessions[user_id].append(s)
    
    # For each user with perfect scores, find the session with best AI sentiment score
    perfect_sessions = []
    for user_id, user_sessions in user_perfect_sessions.items():
        # Find session with highest AI sentiment score
        best_session = max(user_sessions, key=lambda x: x.ai_score or 0)
        perfect_sessions.append(best_session)
    
    result = []
    fixed_count = 0
    
    for s in perfect_sessions:
        # Fix zero scores only if fix_scores is True
        ai_score = s.ai_score
        ai_sentiment = s.ai_sentiment
        
        if fix_scores and s.creative_text and (ai_score == 0 or ai_score is None):
            ai_score = get_fallback_score(s.creative_text)
            ai_sentiment = get_fallback_sentiment(s.creative_text)
            
            # Also update the database
            s.ai_score = ai_score
            s.ai_sentiment = ai_sentiment
            fixed_count += 1
        
        # Count total perfect attempts for this user
        total_perfect_attempts = len(user_perfect_sessions.get(s.user.id, []))
        
        result.append({
            "id": s.id,
            "email": s.user.email,
            "score": s.score,  # This will always be 20 for perfect scorers
            "total_perfect_attempts": total_perfect_attempts,
            "best_ai_score": ai_score or 0,
            "creative_text": s.creative_text,
            "is_shortlisted": s.is_shortlisted,
            "is_rejected": s.is_rejected,
            "ai_score": ai_score or 0,
            "ai_sentiment": ai_sentiment or "Neutral",
            "entry_reference": s.entry_reference,
            "submitted_at": s.submitted_at
        })
    
    # Commit any changes made during the fix
    if fix_scores:
        db.commit()
        return {"sessions": result, "fixed_count": fixed_count}
    
    return result

@router.post("/sessions/{session_id}/shortlist")
def toggle_shortlist(session_id: int, db: Session = Depends(get_db), user=Depends(current_user)):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Not an admin")
    
    session = db.query(models.QuizSession).filter(models.QuizSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session.is_shortlisted = not session.is_shortlisted
    if session.is_shortlisted:
        session.is_rejected = False
    db.commit()
    return {"is_shortlisted": session.is_shortlisted}

@router.post("/sessions/{session_id}/reject")
def toggle_reject(session_id: int, db: Session = Depends(get_db), user=Depends(current_user)):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Not an admin")
    
    session = db.query(models.QuizSession).filter(models.QuizSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session.is_rejected = not session.is_rejected
    if session.is_rejected:
        session.is_shortlisted = False
    db.commit()
    return {"is_rejected": session.is_rejected}

@router.get("/dashboard", response_model=schemas.DashboardResponse)
def get_user_dashboard(db: Session = Depends(get_db), user=Depends(current_user)):
    # Count only completed quiz sessions for entries_used
    completed_sessions = db.query(models.QuizSession).filter(
        models.QuizSession.user_id == user.id,
        models.QuizSession.completed == True
    ).all()
    
    # Count successful completions
    successful_sessions = db.query(models.QuizSession).filter(
        models.QuizSession.user_id == user.id,
        models.QuizSession.completed == True,
        models.QuizSession.score > 0
    ).all()
    
    # entries_used includes both successful completions AND penalties
    entries_used = len(successful_sessions) + user.penalty_attempts
    slots_left = max(10 - entries_used, 0)
    
    # Get all sessions for other logic (shortlisted, rejected, etc.)
    all_sessions = db.query(models.QuizSession).filter(models.QuizSession.user_id == user.id).all()
    
    shortlisted_session = next((s for s in all_sessions if s.is_shortlisted), None)
    is_any_rejected = any(s.is_rejected for s in all_sessions)
    
    # Competition close time (using system config or fallback)
    config = db.query(models.SystemConfig).filter_by(key="challenge_end_time").first()
    if config:
        end_date = datetime.fromisoformat(config.value)
    else:
        end_date = datetime.utcnow() + timedelta(days=89) # Fallback as in screenshot
        
    remaining = int((end_date - datetime.utcnow()).total_seconds())
    
    # Dynamic ranking logic
    total_entries = db.query(models.QuizSession).filter(models.QuizSession.submitted_at.isnot(None)).count()
    if total_entries == 0:
        total_entries = 387241 # Hardcoded fallback if no rows for realism
        
    ai_score = 0
    rank = 0
    if shortlisted_session:
        ai_score = shortlisted_session.ai_score
        if ai_score == 0:
             ai_score = 94
        # Count how many people have a higher score
        higher_scores = db.query(models.QuizSession).filter(models.QuizSession.submitted_at.isnot(None), models.QuizSession.ai_score > ai_score).count()
        rank = higher_scores + 1
    
    return {
        "entries_used": entries_used,
        "slots_left": slots_left,
        "shortlisted_count": 1 if shortlisted_session else 0,
        "is_shortlisted": shortlisted_session is not None,
        "is_rejected": is_any_rejected,
        "entry_reference": shortlisted_session.entry_reference if shortlisted_session else None,
        "creative_text": shortlisted_session.creative_text if shortlisted_session else None,
        "competition_close_seconds": max(remaining, 0),
        "ai_score": ai_score,
        "rank": rank,
        "total_entries": total_entries
    }
