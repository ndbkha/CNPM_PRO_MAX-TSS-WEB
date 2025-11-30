# app/crud.py
from sqlalchemy.orm import Session, joinedload
from . import models
from datetime import datetime, timedelta, timezone
from sqlalchemy import func


# --- CẤU HÌNH MÚI GIỜ VIỆT NAM (UTC+7) ---
def get_vn_time():
    # Lấy giờ UTC hiện tại, cộng thêm 7 tiếng
    utc_now = datetime.now(timezone.utc)
    vn_now = utc_now + timedelta(hours=7)
    # Chuyển về naive (bỏ thông tin timezone) để lưu vào SQLite không bị lỗi
    return vn_now.replace(tzinfo=None)


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
    # 1. Subquery: Đếm số slot còn trống và chưa hết hạn cho từng Tutor
    sub = db.query(
        models.AvailabilitySlot.tutor_id,
        func.count(models.AvailabilitySlot.id).label("free_slots")
    ).filter(
        models.AvailabilitySlot.is_booked == False,
        models.AvailabilitySlot.is_expired == False
    ).group_by(models.AvailabilitySlot.tutor_id).subquery()
    
    # 2. Query chính: Lấy User Tutor JOIN với bảng đếm ở trên
    # Sử dụng outerjoin để lấy cả những Tutor chưa có slot nào (khi đó free_slots = 0)
    q = db.query(models.User, func.coalesce(sub.c.free_slots, 0))\
          .outerjoin(sub, models.User.id == sub.c.tutor_id)\
          .filter(models.User.role == models.RoleEnum.tutor)
    
    results = []
    for user, free_slots in q.all():
        results.append({
            "user": user, 
            "free_slots": int(free_slots) # Chuyển về int cho chắc chắn
        })
    return results


def create_availability(db: Session, tutor_id: int, start_time: datetime):
    # 1. Xóa thông tin múi giờ để đồng bộ với datetime.now() của hệ thống
    # Điều này giúp tránh lỗi "can't compare offset-naive and offset-aware"
    # start_time_naive = start_time.replace(tzinfo=None)
    # now = datetime.now()

    # if start_time_naive < now:
    #     return None, "Không thể tạo lịch trong quá khứ."

    # 1. Xử lý Timezone: Ép về giờ VN Naive
    if start_time.tzinfo:
        # Nếu frontend gửi kèm timezone, chuyển về UTC rồi cộng 7
        start_time = start_time.astimezone(timezone.utc) + timedelta(hours=7)
    
    start_time_naive = start_time.replace(tzinfo=None)
    now_vn = get_vn_time()

    # 2. Check quá khứ theo giờ VN
    if start_time_naive < now_vn:
        return None, "Không thể tạo lịch trong quá khứ (theo giờ Việt Nam)."
    
    # Dùng start_time_naive để tính toán tiếp
    duration = timedelta(hours=2)
    end_time = start_time_naive + duration

    # 2. Check trùng (Chỉ check trùng với các slot CHƯA hết hạn)
    overlap = db.query(models.AvailabilitySlot).filter(
        models.AvailabilitySlot.tutor_id == tutor_id,
        models.AvailabilitySlot.is_expired == False,
        models.AvailabilitySlot.start_time < end_time,
        models.AvailabilitySlot.end_time > start_time_naive
    ).first()

    if overlap:
        return None, "Khung giờ này bị trùng với một lịch trống đang có."

    # Lưu vào DB (Lưu dạng Naive)
    slot = models.AvailabilitySlot(tutor_id=tutor_id, start_time=start_time_naive, end_time=end_time)
    db.add(slot)
    db.commit()
    db.refresh(slot)
    return slot, None


# --- CŨNG CẦN SỬA HÀM NÀY ĐỂ TRÁNH LỖI TƯƠNG TỰ KHI CHẠY AUTO-CLEANUP ---
def expire_old_slots(db: Session):
    # Sử dụng UTC cho chắc chắn, hoặc múi giờ server
    # Nhưng để an toàn với SQLite, ta dùng datetime.now() cơ bản, 
    # SQLAlchemy sẽ tự xử lý so sánh với DB
    now = datetime.now() 
    
    updated_count = db.query(models.AvailabilitySlot).filter(
        models.AvailabilitySlot.end_time < now,
        models.AvailabilitySlot.is_booked == False,
        models.AvailabilitySlot.is_expired == False
    ).update({models.AvailabilitySlot.is_expired: True}, synchronize_session=False)
    
    db.commit()
    return updated_count

def list_availabilities_for_tutor(db: Session, tutor_id: int, only_free: bool = True):
    q = db.query(models.AvailabilitySlot).filter(models.AvailabilitySlot.tutor_id == tutor_id)
    q = q.filter(models.AvailabilitySlot.is_expired == False)
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
    
    if slot.is_expired: 
        return None, "Slot này đã hết hạn, không thể đặt."
    
    if slot.is_booked:
        return None, "Slot already booked"
    booking = models.Booking(
        student_id=student_id, 
        tutor_id=tutor_id, 
        slot_id=slot_id, 
        note=note, 
        status=models.BookingStatusEnum.pending, 
        created_at=get_vn_time()
        )
    
    slot.is_booked = True 
    db.add(slot)
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking, None

def get_booking(db: Session, booking_id: int):
    return db.query(models.Booking).filter(models.Booking.id == booking_id).first()

def list_bookings_for_user(db: Session, user_id: int, role: str):
    if role == "student":
        return db.query(models.Booking)\
            .options(
                joinedload(models.Booking.tutor), 
                joinedload(models.Booking.slot)
                )\
            .filter(models.Booking.student_id == user_id)\
            .order_by(models.Booking.created_at.desc()).all()
            
    elif role == "tutor":
        return db.query(models.Booking)\
            .options(
                joinedload(models.Booking.student),
                joinedload(models.Booking.slot)
                )\
            .filter(models.Booking.tutor_id == user_id)\
            .order_by(models.Booking.created_at.desc()).all()
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
    
    # TRƯỜNG HỢP 1: Lịch đang chờ (Pending) -> Hủy ngay lập tức
    if booking.status == models.BookingStatusEnum.pending:
        booking.status = models.BookingStatusEnum.cancelled
        booking.note = f"Hủy bởi sinh viên (Lịch chưa duyệt). Lý do: {reason or ''}"
        
        # Quan trọng: Phải nhả Slot ra để người khác book được
        slot = get_availability(db, booking.slot_id)
        if slot:
            slot.is_booked = False
            db.add(slot)
            
        db.add(booking)
        db.commit()
        db.refresh(booking)
        return booking, None

    # TRƯỜNG HỢP 2: Lịch đã duyệt (Confirmed) -> Gửi yêu cầu hủy
    elif booking.status == models.BookingStatusEnum.confirmed:
        booking.status = models.BookingStatusEnum.cancel_requested
        booking.note = reason or booking.note
        db.add(booking)
        db.commit()
        db.refresh(booking)
        return booking, None

    # TRƯỜNG HỢP 3: Các trạng thái khác (Đã hủy, Đã hoàn thành...)
    else:
        return None, f"Không thể hủy lịch đang ở trạng thái {booking.status}"
    
    

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