from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Dict, Optional, Union


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str


class VerifyRequest(BaseModel):
    email: EmailStr
    code: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    token: str
    email: EmailStr
    is_admin: bool = False


class EligibilityQuestion(BaseModel):
    id: int
    text: str
    options: List[str]


class EligibilitySubmitRequest(BaseModel):
    answers: Dict[int, List[int]]


class QuizQuestion(BaseModel):
    id: int
    question: str
    options: List[str]
    correct_answer: Optional[int] = None


class StartQuizResponse(BaseModel):
    session_id: int
    total_questions: int
    total_duration_seconds: int
    current_question: QuizQuestion
    current_index: int


class SubmitAnswerRequest(BaseModel):
    answer_index: int


class SubmitAnswerResponse(BaseModel):
    completed: bool
    timed_out: bool
    correct: bool = True
    next_index: Optional[int] = None
    next_question: Optional[QuizQuestion] = None


class RankingEntry(BaseModel):
    email: str
    score: int
    rank: int


class QuizResultResponse(BaseModel):
    score: int
    total_questions: int
    attempts_count: int = 0
    ranking: List[RankingEntry]


# Creative Submission
class CreativeSubmitRequest(BaseModel):
    text: str


class CreativeSubmitResponse(BaseModel):
    entry_reference: str
    submitted_at: str


# Admin Schemas
class AdminSessionEntry(BaseModel):
    id: int
    email: str
    score: int
    creative_text: Optional[str] = None
    is_shortlisted: bool
    is_rejected: bool
    ai_score: int
    ai_sentiment: Optional[str] = None
    entry_reference: Optional[str] = None
    submitted_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class DashboardResponse(BaseModel):
    entries_used: int
    slots_left: int
    shortlisted_count: int
    is_shortlisted: bool
    is_rejected: bool
    entry_reference: Optional[str]
    creative_text: Optional[str] = None
    competition_close_seconds: int
    ai_score: int = 0
    rank: int = 0
    total_entries: int = 0
