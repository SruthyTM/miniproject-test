import sqlite3
import os

db_path = 'quiz_app.db'

if not os.path.exists(db_path):
    print(f"Database {db_path} not found.")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

def add_column(table, column, type_def):
    try:
        cursor.execute(f"ALTER TABLE {table} ADD COLUMN {column} {type_def}")
        print(f"Added column {column} to table {table}")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e).lower():
            print(f"Column {column} already exists in {table}")
        else:
            print(f"Error adding {column} to {table}: {e}")

# Adding missing columns for User model
add_column("users", "is_admin", "BOOLEAN DEFAULT 0 NOT NULL")

# Adding missing columns for QuizSession model
add_column("quiz_sessions", "creative_text", "TEXT")
add_column("quiz_sessions", "is_shortlisted", "BOOLEAN DEFAULT 0 NOT NULL")
add_column("quiz_sessions", "entry_reference", "VARCHAR")
add_column("quiz_sessions", "submitted_at", "DATETIME")

conn.commit()
conn.close()
print("Migration completed.")
