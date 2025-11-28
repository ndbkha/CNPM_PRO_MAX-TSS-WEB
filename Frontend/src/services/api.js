// src/services/api.js

const API_URL = "http://127.0.0.1:8000"; // Đảm bảo Backend Python đang chạy ở port này

// Helper lấy header
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// --- AUTH ---
export const loginAPI = async (username, password) => {
  // FastAPI OAuth2 yêu cầu Form Data
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await fetch(`${API_URL}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });

  if (!response.ok) throw new Error("Đăng nhập thất bại");
  return response.json(); // Trả về { access_token, token_type }
};

// --- EVENTS / TUTOR ---

// 1. Lấy danh sách Tutor
export const getTutorsAPI = async () => {
  const response = await fetch(`${API_URL}/events/tutors`, {
    method: "GET",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
  });
  return response.json();
};

// 2. Lấy lịch rảnh của 1 Tutor
export const getTutorAvailability = async (tutorId) => {
  const response = await fetch(`${API_URL}/events/tutors/${tutorId}/availability`, {
    method: "GET",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
  });
  return response.json();
};

// 3. Đặt lịch (Sinh viên book slot)
export const createBookingAPI = async (tutorId, slotId, note) => {
  // Lấy student_id từ token (decode JWT đơn giản)
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Vui lòng đăng nhập");
  
  const payload = JSON.parse(atob(token.split('.')[1]));
  const studentId = parseInt(payload.sub);

  const body = {
    student_id: studentId,
    tutor_id: tutorId,
    slot_id: slotId,
    note: note || ""
  };

  const response = await fetch(`${API_URL}/events/book`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Lỗi đặt lịch");
  }
  return response.json();
};

// // 4. Lấy danh sách lịch hẹn của tôi
// export const getMyBookingsAPI = async () => {
//   const response = await fetch(`${API_URL}/events/my`, {
//     method: "GET",
//     headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
//   });
//   return response.json();
// };

// // 5. Yêu cầu hủy lịch (Gửi request để Tutor duyệt)
// export const requestCancelAPI = async (bookingId, reason) => {
//   const response = await fetch(`${API_URL}/events/request_cancel`, {
//     method: "POST",
//     headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
//     body: JSON.stringify({ booking_id: bookingId, reason: reason }),
//   });
//   if (!response.ok) throw new Error("Không thể gửi yêu cầu hủy");
//   return response.json();
// };

// 1. Lấy lịch của tôi (Sinh viên & Tutor)
export const getMyBookingsAPI = async () => {
  const response = await fetch(`${API_URL}/events/my`, {
    method: "GET",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
  });
  return response.json();
};

// 2. [TUTOR] Tạo lịch trống
export const createAvailabilityAPI = async (startTime) => {
  // startTime dạng ISO: "2023-11-20T09:00:00"
  const response = await fetch(`${API_URL}/tutor/availability`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ start_time: startTime }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Lỗi tạo lịch");
  }
  return response.json();
};

// 3. [STUDENT] Yêu cầu hủy lịch
export const studentRequestCancelAPI = async (bookingId, reason) => {
  const response = await fetch(`${API_URL}/events/request_cancel`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ booking_id: bookingId, reason: reason }),
  });
  if (!response.ok) throw new Error("Lỗi gửi yêu cầu hủy");
  return response.json();
};

// 4. [TUTOR] Hủy lịch (Tutor hủy trực tiếp)
export const tutorCancelBookingAPI = async (bookingId) => {
  const response = await fetch(`${API_URL}/tutor/bookings/${bookingId}/cancel_by_tutor`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Lỗi hủy lịch");
  return response.json();
};
