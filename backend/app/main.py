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
        
        # --- 1. 3 Tài khoản Sinh viên (Students) ---
        crud.create_user(db,
            "annguyen@hcmut.edu.vn",
            "Nguyễn Văn An",
            "Khoa Học và Kỹ Thuật Máy Tính", # Khoa CNTT
            "student",
            get_password_hash("123456")
        )
        crud.create_user(db,
            "thipham@hcmut.edu.vn",
            "Phạm Thị Thi",
            "Điện - Điện Tử", # Khoa Điện
            "student",
            get_password_hash("123456")
        )
        crud.create_user(db,
            "kienle@hcmut.edu.vn",
            "Lê Hoàng Kiên",
            "Kỹ Thuật Xây Dựng", # Khoa Xây Dựng
            "student",
            get_password_hash("123456")
        )

        # --- 2. 6 Tài khoản Tutor ---
        crud.create_user(db,
            "longtran@hcmut.edu.vn",
            "Trần Minh Long",
            "Khoa Học và Kỹ Thuật Máy Tính",
            "tutor",
            get_password_hash("123456")
        )
        crud.create_user(db,
            "haivoc@hcmut.edu.vn",
            "Võ Hải",
            "Công Nghệ Vật Liệu", # Khoa Vật Liệu
            "tutor",
            get_password_hash("123456")
        )
        crud.create_user(db,
            "tuanna@hcmut.edu.vn",
            "Nguyễn Anh Tuấn",
            "Kỹ Thuật Hóa Học", # Khoa Hóa
            "tutor",
            get_password_hash("123456")
        )
        crud.create_user(db,
            "minhdo@hcmut.edu.vn",
            "Đỗ Văn Minh",
            "Cơ Khí", # Khoa Cơ Khí
            "tutor",
            get_password_hash("123456")
        )
        crud.create_user(db,
            "linhhoang@hcmut.edu.vn",
            "Hoàng Thúy Linh",
            "Quản Lý Công Nghiệp", # Khoa QLCN
            "tutor",
            get_password_hash("123456")
        )
        crud.create_user(db,
            "huyho@hcmut.edu.vn",
            "Hồ Quốc Huy",
            "Kỹ Thuật Giao Thông", # Khoa Giao Thông
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