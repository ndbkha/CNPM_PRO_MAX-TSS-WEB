# app/main.py
from fastapi import FastAPI
from pathlib import Path

from app.db import engine, Base, SessionLocal
from app import models, crud
from app.auth import get_password_hash, router as auth_router
from app.api_tutors import router as tutor_router
from app.api_events import router as events_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="HCMUT Tutor Scheduling")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # hoặc ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


DB_FILE = Path("tutor_system.db")

@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(models.User).count() == 0:
        print("Seeding default users...")
        crud.create_user(db,
            "student1@hcmut.edu.vn",
            "Student One",
            "CNTT",
            "student",
            get_password_hash("123456")
        )
        crud.create_user(db,
            "tutor1@hcmut.edu.vn",
            "Tutor One",
            "CNTT",
            "tutor",
            get_password_hash("123456")
        )
        crud.create_user(db,
            "tutor2@hcmut.edu.vn",
            "Tutor Two",
            "Dien",
            "tutor",
            get_password_hash("123456")
        )

    db.close()

# ⭐⭐ PHẢI CÓ 3 include_router NÀY ⭐⭐
app.include_router(auth_router)
app.include_router(tutor_router)
app.include_router(events_router)

@app.get("/")
def root():
    return {"msg": "backend ok"}