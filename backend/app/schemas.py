# app/schemas.py
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

class Role(str, Enum):
    student = "student"
    tutor = "tutor"

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    faculty: Optional[str]
    role: Role
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    faculty: Optional[str]
    role: Role
    class Config:
        orm_mode = True

class AvailabilityCreate(BaseModel):
    start_time: datetime

class AvailabilityOut(BaseModel):
    id: int
    tutor_id: int
    start_time: datetime
    end_time: datetime
    is_booked: bool

    class Config:
        class Config: orm_mode = True

class TutorSummary(BaseModel):
    id: int
    full_name: str
    faculty: Optional[str]
    free_slots: int

class BookingCreate(BaseModel):
    student_id: int
    tutor_id: int
    slot_id: int
    note: Optional[str] = None

class BookingOut(BaseModel):
    id: int
    student_id: int
    tutor_id: int
    slot_id: int
    status: str
    note: Optional[str]
    created_at: datetime
    updated_at: datetime
    class Config:
        orm_mode = True

class RescheduleRequest(BaseModel):
    booking_id: int
    new_slot_id: int
    reason: Optional[str] = None

class CancelRequest(BaseModel):
    booking_id: int
    reason: Optional[str] = None