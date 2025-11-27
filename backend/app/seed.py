# app/seed.py
from .db import SessionLocal
from .models import User
from .auth import get_password_hash

def seed_users():
    db = SessionLocal()
    if db.query(User).count() == 0:
        print("Seeding default users...")
        student = User(email="student1@hcmut.edu.vn", full_name="Student One", faculty="CNTT", role="student", hashed_password=get_password_hash("123456"))
        tutor = User(email="tutor1@hcmut.edu.vn", full_name="Tutor One", faculty="CNTT", role="tutor", hashed_password=get_password_hash("123456"))
        db.add(student); db.add(tutor); db.commit()
    db.close()

    