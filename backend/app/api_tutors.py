# app/api_tutors.py
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from . import db, crud, schemas, auth

router = APIRouter(prefix="/tutor", tags=["tutor"])

def require_tutor(user=Depends(auth.get_current_user)):
    if user.role.value != "tutor":
        raise HTTPException(status_code=403, detail="Requires tutor role")
    return user

@router.post("/availability", response_model=schemas.AvailabilityOut)
def create_availability(payload: schemas.AvailabilityCreate, current_user=Depends(require_tutor), database: Session = Depends(db.get_db)):
    slot = crud.create_availability(database, current_user.id, payload.start_time)
    return slot

@router.get("/availability", response_model=List[schemas.AvailabilityOut])
def list_my_availability(current_user=Depends(require_tutor), database: Session = Depends(db.get_db)):
    return crud.list_availabilities_for_tutor(database, current_user.id, only_free=False)

@router.get("/bookings", response_model=List[schemas.BookingOut])
def list_my_bookings(current_user=Depends(require_tutor), database: Session = Depends(db.get_db)):
    return crud.list_bookings_for_user(database, current_user.id, role="tutor")

@router.post("/bookings/{booking_id}/confirm", response_model=schemas.BookingOut)
def confirm_booking(booking_id: int, background_tasks: BackgroundTasks, current_user=Depends(require_tutor), database: Session = Depends(db.get_db)):
    booking = crud.get_booking(database, booking_id)
    if not booking or booking.tutor_id != current_user.id:
        raise HTTPException(status_code=404, detail="Booking not found")
    b, err = crud.tutor_confirm_booking(database, booking_id)
    if err:
        raise HTTPException(status_code=400, detail=err)
    # demo notify (print)
    background_tasks.add_task(lambda: print(f"[NOTIFY] Student {booking.student.email}: booking {booking_id} confirmed"))
    return b

@router.post("/bookings/{booking_id}/cancel_by_tutor", response_model=schemas.BookingOut)
def cancel_by_tutor(booking_id: int, background_tasks: BackgroundTasks, current_user=Depends(require_tutor), database: Session = Depends(db.get_db)):
    booking = crud.get_booking(database, booking_id)
    if not booking or booking.tutor_id != current_user.id:
        raise HTTPException(status_code=404, detail="Booking not found")
    b, err = crud.tutor_cancel_booking(database, booking_id)
    if err:
        raise HTTPException(status_code=400, detail=err)
    background_tasks.add_task(lambda: print(f"[NOTIFY] Student {booking.student.email}: booking {booking_id} cancelled by tutor"))
    return b

@router.post("/bookings/{booking_id}/accept_reschedule/{new_slot_id}", response_model=schemas.BookingOut)
def accept_reschedule(booking_id: int, new_slot_id: int, background_tasks: BackgroundTasks, current_user=Depends(require_tutor), database: Session = Depends(db.get_db)):
    booking = crud.get_booking(database, booking_id)
    if not booking or booking.tutor_id != current_user.id:
        raise HTTPException(status_code=404, detail="Booking not found")
    b, err = crud.tutor_accept_reschedule(database, booking_id, new_slot_id)
    if err:
        raise HTTPException(status_code=400, detail=err)
    background_tasks.add_task(lambda: print(f"[NOTIFY] Student {booking.student.email}: reschedule accepted"))
    return b

@router.post("/bookings/{booking_id}/confirm_cancel_request", response_model=schemas.BookingOut)
def confirm_cancel_request(booking_id: int, background_tasks: BackgroundTasks, current_user=Depends(require_tutor), database: Session = Depends(db.get_db)):
    booking = crud.get_booking(database, booking_id)
    if not booking or booking.tutor_id != current_user.id:
        raise HTTPException(status_code=404, detail="Booking not found")
    b, err = crud.tutor_confirm_cancel_request(database, booking_id)
    if err:
        raise HTTPException(status_code=400, detail=err)
    background_tasks.add_task(lambda: print(f"[NOTIFY] Student {booking.student.email}: cancel request confirmed"))
    return b