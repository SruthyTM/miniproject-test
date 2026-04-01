from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    email: EmailStr


class VerifyRequest(BaseModel):
    email: EmailStr
    code: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    token: str
    email: EmailStr


class EligibilityQuestion(BaseModel):
    id: int
    text: str
    options: list[str]


class EligibilitySubmitRequest(BaseModel):
    answers: dict[int, list[int]]


class QuizQuestion(BaseModel):
    id: int
    question: str
    options: list[str]


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
    next_index: int | None = None
    next_question: QuizQuestion | None = None


class QuizResultResponse(BaseModel):
    score: int
    total_questions: int
    ranking: list[dict[str, int | str]]
