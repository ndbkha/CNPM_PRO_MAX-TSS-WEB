import requests
import json

BASE = "http://127.0.0.1:8000"

def pretty(title, obj):
    print("\n========== " + title + " ==========")
    print(json.dumps(obj, indent=2))


def login(email, password):
    r = requests.post(f"{BASE}/auth/token",
        data={"username": email, "password": password})
    token = r.json().get("access_token")
    pretty(f"Login {email}", r.json())
    return token


def auth_header(token):
    return {"Authorization": f"Bearer {token}"}


# -------------------------------------------------
# 1. LOGIN TUTOR
# -------------------------------------------------
tutor_token = login("tutor1@hcmut.edu.vn", "123456")

# 2. TUTOR TẠO SLOT 1
slot1 = requests.post(
    f"{BASE}/tutor/availability",
    headers=auth_header(tutor_token),
    json={"start_time": "2025-01-01T09:00:00"}
).json()
pretty("Tutor tạo slot 1", slot1)

# 3. TUTOR TẠO SLOT 2
slot2 = requests.post(
    f"{BASE}/tutor/availability",
    headers=auth_header(tutor_token),
    json={"start_time": "2025-01-02T09:00:00"}
).json()
pretty("Tutor tạo slot 2", slot2)

slot1_id = slot1["id"]
slot2_id = slot2["id"]


# -------------------------------------------------
# 4. LOGIN STUDENT
# -------------------------------------------------
student_token = login("student1@hcmut.edu.vn", "123456")


# -------------------------------------------------
# 5. STUDENT BOOK SLOT 1
# -------------------------------------------------
booking = requests.post(
    f"{BASE}/events/book",
    headers=auth_header(student_token),
    json={
        "student_id": 1,
        "tutor_id": 2,
        "slot_id": slot1_id
    }
).json()
pretty("Student book slot 1", booking)

booking_id = booking["id"]


# -------------------------------------------------
# 6. TUTOR CONFIRM BOOKING
# -------------------------------------------------
confirm = requests.post(
    f"{BASE}/tutor/bookings/{booking_id}/confirm",
    headers=auth_header(tutor_token)
).json()
pretty("Tutor confirm booking", confirm)


# -------------------------------------------------
# 7. STUDENT REQUEST RESCHEDULE → SLOT 2
# -------------------------------------------------
res = requests.post(
    f"{BASE}/events/request_reschedule",
    headers=auth_header(student_token),
    json={
        "booking_id": booking_id,
        "new_slot_id": slot2_id,
        "reason": "Dời lịch"
    }
).json()
pretty("Student request reschedule", res)


# -------------------------------------------------
# 8. TUTOR ACCEPT RESCHEDULE
# -------------------------------------------------
res2 = requests.post(
    f"{BASE}/tutor/bookings/{booking_id}/accept_reschedule/{slot2_id}",
    headers=auth_header(tutor_token)
).json()
pretty("Tutor accept reschedule", res2)


# -------------------------------------------------
# 9. STUDENT CHECK FINAL BOOKINGS
# -------------------------------------------------
my_bookings = requests.get(
    f"{BASE}/events/my",
    headers=auth_header(student_token)
).json()
pretty("Student final bookings", my_bookings)

print("\n🎉 DONE — Full flow executed successfully!\n")