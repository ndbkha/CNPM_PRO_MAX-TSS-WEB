# app/crud.py
from sqlalchemy.orm import Session
from . import models
from datetime import timedelta
from sqlalchemy import func

# Users
def create_user(db: Session, email: str, full_name: str, faculty: str, role: str, hashed_password: str):
    user = models.User(email=email, full_name=full_name, faculty=faculty, role=role, hashed_password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def list_tutors_with_free_slots(db: Session):
    sub = db.query(models.AvailabilitySlot.tutor_id, func.count(models.AvailabilitySlot.id).label("free_slots"))\
            .filter(models.AvailabilitySlot.is_booked == False)\
            .group_by(models.AvailabilitySlot.tutor_id)\
            .subquery()
    q = db.query(models.User, func.coalesce(sub.c.free_slots, 0)).filter(models.User.role == models.RoleEnum.tutor)
    results = []
    for user, free_slots in q.all():
        results.append({"user": user, "free_slots": int(free_slots or 0)})
    return results

# Availability
def create_availability(db: Session, tutor_id: int, start_time):
    end_time = start_time + timedelta(hours=2)
    slot = models.AvailabilitySlot(tutor_id=tutor_id, start_time=start_time, end_time=end_time)
    db.add(slot)
    db.commit()
    db.refresh(slot)
    return slot

def list_availabilities_for_tutor(db: Session, tutor_id: int, only_free: bool = True):
    q = db.query(models.AvailabilitySlot).filter(models.AvailabilitySlot.tutor_id == tutor_id)
    if only_free:
        q = q.filter(models.AvailabilitySlot.is_booked == False)
    return q.order_by(models.AvailabilitySlot.start_time).all()

def get_availability(db: Session, slot_id: int):
    return db.query(models.AvailabilitySlot).filter(models.AvailabilitySlot.id == slot_id).first()

def mark_slot_booked(db: Session, slot_id: int):
    slot = get_availability(db, slot_id)
    if slot:
        slot.is_booked = True
        db.add(slot)
        db.commit()
        db.refresh(slot)
    return slot

def mark_slot_unbooked(db: Session, slot_id: int):
    slot = get_availability(db, slot_id)
    if slot:
        slot.is_booked = False
        db.add(slot)
        db.commit()
        db.refresh(slot)
    return slot

# Bookings
def create_booking(db: Session, student_id: int, tutor_id: int, slot_id: int, note: str = None):
    slot = get_availability(db, slot_id)
    if not slot:
        return None, "Slot not found"
    if slot.is_booked:
        return None, "Slot already booked"
    booking = models.Booking(student_id=student_id, tutor_id=tutor_id, slot_id=slot_id, note=note, status=models.BookingStatusEnum.pending)
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking, None

def get_booking(db: Session, booking_id: int):
    return db.query(models.Booking).filter(models.Booking.id == booking_id).first()

def list_bookings_for_user(db: Session, user_id: int, role: str):
    if role == "student":
        return db.query(models.Booking).filter(models.Booking.student_id == user_id).order_by(models.Booking.created_at.desc()).all()
    elif role == "tutor":
        return db.query(models.Booking).filter(models.Booking.tutor_id == user_id).order_by(models.Booking.created_at.desc()).all()
    else:
        return []

def tutor_confirm_booking(db: Session, booking_id: int):
    booking = get_booking(db, booking_id)
    if not booking:
        return None, "Booking not found"
    if booking.status not in (models.BookingStatusEnum.pending, models.BookingStatusEnum.reschedule_requested):
        return None, f"Cannot confirm booking in status {booking.status}"
    slot = get_availability(db, booking.slot_id)
    if slot.is_booked:
        return None, "Slot already booked"
    slot.is_booked = True
    booking.status = models.BookingStatusEnum.confirmed
    db.add(slot); db.add(booking); db.commit(); db.refresh(booking)
    return booking, None

def tutor_cancel_booking(db: Session, booking_id: int, reason: str = None):
    booking = get_booking(db, booking_id)
    if not booking:
        return None, "Booking not found"
    booking.status = models.BookingStatusEnum.cancelled
    slot = get_availability(db, booking.slot_id)
    if slot:
        slot.is_booked = False
        db.add(slot)
    db.add(booking); db.commit(); db.refresh(booking)
    return booking, None

def student_request_cancel(db: Session, booking_id: int, reason: str = None):
    booking = get_booking(db, booking_id)
    if not booking:
        return None, "Booking not found"
    if booking.status not in (models.BookingStatusEnum.confirmed, models.BookingStatusEnum.pending):
        return None, f"Cannot request cancel in status {booking.status}"
    booking.status = models.BookingStatusEnum.cancel_requested
    booking.note = reason or booking.note
    db.add(booking); db.commit(); db.refresh(booking)
    return booking, None

def student_request_reschedule(db: Session, booking_id: int, new_slot_id: int, reason: str = None):
    booking = get_booking(db, booking_id)
    new_slot = get_availability(db, new_slot_id)
    if not booking:
        return None, "Booking not found"
    if not new_slot:
        return None, "New slot not found"
    if new_slot.is_booked:
        return None, "New slot already booked"
    booking.status = models.BookingStatusEnum.reschedule_requested
    booking.note = f"Reschedule to slot {new_slot_id}. Reason: {reason or ''}"
    db.add(booking); db.commit(); db.refresh(booking)
    return booking, None

def tutor_accept_reschedule(db: Session, booking_id: int, new_slot_id: int):
    booking = get_booking(db, booking_id)
    new_slot = get_availability(db, new_slot_id)
    if not booking:
        return None, "Booking not found"
    if not new_slot:
        return None, "New slot not found"
    if new_slot.is_booked:
        return None, "New slot already booked"
    old_slot = get_availability(db, booking.slot_id)
    if old_slot:
        old_slot.is_booked = False
        db.add(old_slot)
    new_slot.is_booked = True
    booking.slot_id = new_slot_id
    booking.status = models.BookingStatusEnum.confirmed
    db.add(new_slot); db.add(booking); db.commit(); db.refresh(booking)
    return booking, None

def tutor_confirm_cancel_request(db: Session, booking_id: int):
    booking = get_booking(db, booking_id)
    if not booking:
        return None, "Booking not found"
    if booking.status != models.BookingStatusEnum.cancel_requested:
        return None, "No cancel request pending"
    booking.status = models.BookingStatusEnum.cancelled
    slot = get_availability(db, booking.slot_id)
    if slot:
        slot.is_booked = False
        db.add(slot)
    db.add(booking); db.commit(); db.refresh(booking)
    return booking, None