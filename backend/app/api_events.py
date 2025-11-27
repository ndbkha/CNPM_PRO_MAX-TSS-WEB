# app/api_events.py
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from . import db, crud, schemas, auth

router = APIRouter(prefix="/events", tags=["events"])

def require_student(user=Depends(auth.get_current_user)):
    if user.role.value != "student":
        raise HTTPException(status_code=403, detail="Requires student role")
    return user

@router.get("/tutors", response_model=List[schemas.TutorSummary])
def list_tutors(database: Session = Depends(db.get_db)):
    raw = crud.list_tutors_with_free_slots(database)
    out = []
    for item in raw:
        user = item["user"]
        free_slots = item["free_slots"]
        out.append(schemas.TutorSummary(id=user.id, full_name=user.full_name, faculty=user.faculty, free_slots=free_slots))
    return out

@router.get("/tutors/{tutor_id}/availability", response_model=List[schemas.AvailabilityOut])
def list_tutor_availability(tutor_id: int, from_dt: datetime = Query(None), to_dt: datetime = Query(None), database: Session = Depends(db.get_db)):
    slots = crud.list_availabilities_for_tutor(database, tutor_id, only_free=True)
    if from_dt:
        slots = [s for s in slots if s.start_time >= from_dt]
    if to_dt:
        slots = [s for s in slots if s.start_time <= to_dt]
    return slots

@router.post("/book", response_model=schemas.BookingOut)
def create_booking(payload: schemas.BookingCreate, background_tasks: BackgroundTasks, current_user=Depends(require_student), database: Session = Depends(db.get_db)):
    if payload.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only create booking for yourself")
    b, err = crud.create_booking(database, payload.student_id, payload.tutor_id, payload.slot_id, note=payload.note)
    if err:
        raise HTTPException(status_code=400, detail=err)
    background_tasks.add_task(lambda: print(f"[NOTIFY] Tutor {b.tutor.email}: new booking pending"))
    return b

@router.get("/my", response_model=List[schemas.BookingOut])
def list_my_bookings(current_user=Depends(auth.get_current_user), database: Session = Depends(db.get_db)):
    return crud.list_bookings_for_user(database, current_user.id, role=current_user.role.value)

@router.post("/request_cancel", response_model=schemas.BookingOut)
def request_cancel(payload: schemas.CancelRequest, background_tasks: BackgroundTasks, current_user=Depends(require_student), database: Session = Depends(db.get_db)):
    booking = crud.get_booking(database, payload.booking_id)
    if not booking or booking.student_id != current_user.id:
        raise HTTPException(status_code=404, detail="Booking not found")
    b, err = crud.student_request_cancel(database, payload.booking_id, reason=payload.reason)
    if err:
        raise HTTPException(status_code=400, detail=err)
    background_tasks.add_task(lambda: print(f"[NOTIFY] Tutor {b.tutor.email}: student requested cancel"))
    return b

@router.post("/request_reschedule", response_model=schemas.BookingOut)
def request_reschedule(payload: schemas.RescheduleRequest, background_tasks: BackgroundTasks, current_user=Depends(require_student), database: Session = Depends(db.get_db)):
    booking = crud.get_booking(database, payload.booking_id)
    if not booking or booking.student_id != current_user.id:
        raise HTTPException(status_code=404, detail="Booking not found")
    b, err = crud.student_request_reschedule(database, payload.booking_id, payload.new_slot_id, reason=payload.reason)
    if err:
        raise HTTPException(status_code=400, detail=err)
    background_tasks.add_task(lambda: print(f"[NOTIFY] Tutor {b.tutor.email}: student requested reschedule"))
    return b