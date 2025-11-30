# app/models.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from .db import Base

class RoleEnum(str, enum.Enum):
    student = "student"
    tutor = "tutor"

class BookingStatusEnum(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"
    cancel_requested = "cancel_requested"
    reschedule_requested = "reschedule_requested"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    faculty = Column(String, nullable=True)
    role = Column(Enum(RoleEnum), nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    availabilities = relationship("AvailabilitySlot", back_populates="tutor")
    bookings_as_student = relationship("Booking", back_populates="student", foreign_keys="Booking.student_id")
    bookings_as_tutor = relationship("Booking", back_populates="tutor", foreign_keys="Booking.tutor_id")

class AvailabilitySlot(Base):
    __tablename__ = "availability_slots"
    id = Column(Integer, primary_key=True, index=True)
    tutor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    is_booked = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    is_expired = Column(Boolean, default=False) 

    tutor = relationship("User", back_populates="availabilities")
    booking = relationship("Booking", back_populates="slot", uselist=False)

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    tutor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    slot_id = Column(Integer, ForeignKey("availability_slots.id"), nullable=False)
    status = Column(Enum(BookingStatusEnum), default=BookingStatusEnum.pending)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    student = relationship("User", back_populates="bookings_as_student", foreign_keys=[student_id])
    tutor = relationship("User", back_populates="bookings_as_tutor", foreign_keys=[tutor_id])
    slot = relationship("AvailabilitySlot", back_populates="booking")