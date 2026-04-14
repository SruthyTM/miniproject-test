#!/usr/bin/env python3
"""
Database migration script to add missing columns
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine
from sqlalchemy import text

def add_missing_columns():
    """Add missing columns to the database"""
    try:
        with engine.connect() as conn:
            result = conn.execute(text("PRAGMA table_info(quiz_sessions)"))
            columns = [row[1] for row in result.fetchall()]
            
            print(f"Current columns: {columns}")
            
            # Add missing columns if they don't exist
            if 'ai_sentiment' not in columns:
                print("Adding ai_sentiment column...")
                conn.execute(text("ALTER TABLE quiz_sessions ADD COLUMN ai_sentiment VARCHAR(100)"))
                print("ai_sentiment column added successfully")
            
            if 'entry_reference' not in columns:
                print("Adding entry_reference column...")
                conn.execute(text("ALTER TABLE quiz_sessions ADD COLUMN entry_reference VARCHAR(100)"))
                print("entry_reference column added successfully")
            
            if 'submitted_at' not in columns:
                print("Adding submitted_at column...")
                conn.execute(text("ALTER TABLE quiz_sessions ADD COLUMN submitted_at DATETIME"))
                print("submitted_at column added successfully")
            
            conn.commit()
            print("Migration completed successfully!")
            
    except Exception as e:
        print(f"Migration error: {e}")

if __name__ == "__main__":
    add_missing_columns()
