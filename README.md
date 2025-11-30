# HCMUT Tutor Support System (BK-TSS)

Hệ thống quản lý chương trình Tutor/Mentor tại trường Đại học Bách Khoa - ĐHQG TP.HCM. Hệ thống hỗ trợ sinh viên đăng ký lịch hẹn, xem tiến độ học tập và giúp Tutor quản lý lịch rảnh, xác nhận buổi hẹn.

- Backend: Python, FastAPI, SQLAlchemy, SQLite.
- Frontend: ReactJS, Vite, Tailwind CSS.
- Database: SQLite (File `tutor_system.db` tự động tạo).

---

#Hướng dẫn Cài đặt & Chạy

1. Chuẩn bị môi trường (Prerequisites)
Đảm bảo máy tính của bạn đã cài đặt:
- [Python 3.8+](https://www.python.org/downloads/)
- [Node.js 16+](https://nodejs.org/)
- [Git](https://git-scm.com/)


2. Cài đặt và Chạy Backend (Python)

Backend chạy tại cổng: `http://127.0.0.1:8000`

# Mở Terminal và truy cập vào thư mục backend:
cd backend

# Trên macOS/Linux:
python3 -m venv venv
source venv/bin/activate

# Cài các thư viện cần thiết
pip install -r requirements.txt

# Chạy Server
uvicorn app.main:app --reload

Kiểm tra: Truy cập http://127.0.0.1:8000/docs để xem tài liệu API (Swagger UI).

3. Cài đặt và Chạy Frontend (React)
Frontend chạy tại cổng: http://localhost:5173

# Truy cập thư mục Frontend
cd Fronend

#  Cài đặt các thư viện Node modules
npm install

# Khởi chạy ứng dụng
npm run dev
