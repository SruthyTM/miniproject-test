#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import User, QuizSession

def check_dashboard_data():
    db = SessionLocal()
    try:
        # Check all users
        users = db.query(User).all()
        print(f"Total users in database: {len(users)}")
        
        for user in users:
            print(f"\nUser: {user.email} (ID: {user.id})")
            
            # Get all sessions for this user
            sessions = db.query(QuizSession).filter(QuizSession.user_id == user.id).all()
            entries_used = len(sessions)
            slots_left = max(10 - entries_used, 0)
            
            print(f"  Sessions: {len(sessions)}")
            print(f"  Entries used: {entries_used}")
            print(f"  Slots left: {slots_left}")
            print(f"  Button should show: {slots_left > 0}")
            
            # Show session details
            for session in sessions:
                print(f"    Session {session.id}: completed={session.completed}, score={session.score}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    check_dashboard_data()
