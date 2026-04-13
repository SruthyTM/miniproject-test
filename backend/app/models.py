from datetime import datetime
from typing import List, Optional, Union

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, Column
from sqlalchemy.orm import relationship

from .database import Base


class SystemConfig(Base):
    __tablename__ = "system_config"

    key = Column(String, primary_key=True, index=True)
    value = Column(String, nullable=False)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    verification_code = Column(String, nullable=False)
    best_score = Column(Integer, default=0, nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)

    quiz_sessions = relationship(
        "QuizSession", back_populates="user", cascade="all, delete-orphan"
    )


class AuthToken(Base):
    __tablename__ = "auth_tokens"

    token = Column(String, primary_key=True)
    user_id = Column(ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")


class QuizSession(Base):
    __tablename__ = "quiz_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(ForeignKey("users.id"), nullable=False)
    current_index = Column(Integer, default=0, nullable=False)
    score = Column(Integer, default=0, nullable=False)
    started_at = Column(DateTime, default=datetime.utcnow)
    duration_seconds = Column(Integer, default=300, nullable=False)
    completed = Column(Boolean, default=False, nullable=False)
    timed_out = Column(Boolean, default=False, nullable=False)
    
    # New fields for Creative Submission
    creative_text = Column(Text, nullable=True)
    is_shortlisted = Column(Boolean, default=False, nullable=False)
    entry_reference = Column(String, nullable=True)
    submitted_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="quiz_sessions")
