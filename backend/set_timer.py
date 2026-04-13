from datetime import datetime, timedelta
from app.database import SessionLocal
from app import models

db = SessionLocal()

# Set to 500 hours from now
new_end_time = datetime.utcnow() + timedelta(hours=500)

config = db.query(models.SystemConfig).filter_by(key="challenge_end_time").first()

if config:
    print(f"Updating existing challenge_end_time from {config.value} to {new_end_time.isoformat()}")
    config.value = new_end_time.isoformat()
else:
    print(f"Creating new challenge_end_time: {new_end_time.isoformat()}")
    config = models.SystemConfig(key="challenge_end_time", value=new_end_time.isoformat())
    db.add(config)

db.commit()
db.close()
print("Successfully set challenge timer to 500 hours.")
