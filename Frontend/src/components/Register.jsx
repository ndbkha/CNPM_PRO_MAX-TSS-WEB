import React, { useState, useEffect } from "react";
import TutorModal from "./TutorModal";
import CardSection from "./Card/CardSection";
import { UserCheck, Users } from "lucide-react";
import { getTutorsAPI } from "../services/api"; // Import API

const studentCards = [
  { icon: UserCheck, title: "LỰA CHỌN TUTOR/MENTOR" },
  { icon: Users, title: "GỢI Ý TUTOR/MENTOR" },
];

const Register = () => {
  const userRole = localStorage.getItem("role");
  const myFaculty = localStorage.getItem("faculty"); 
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  
  // State lưu danh sách tutor lấy từ API
  const [apiTutors, setApiTutors] = useState([]); 
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [modalTitle, setModalTitle] = useState(""); // Thêm title để thay đổi tiêu đề Modal

  // Load Tutor từ Backend khi vào trang
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const data = await getTutorsAPI();
        const formattedData = data.map((item, index) => ({
            stt: index + 1,
            id: item.id,
            name: item.full_name,
            // Lưu ý: Đảm bảo tên khoa trong DB User sinh viên và Tutor GIỐNG HỆT NHAU
            // Ví dụ cùng là "CNTT" hoặc "Khoa KH&KT Máy Tính"
            department: item.faculty || "Chưa cập nhật", 
            slots: item.free_slots
        }));
        setApiTutors(formattedData);
      } catch (err) {
        console.error("Lỗi load tutors:", err);
      }
    };
    
    if (userRole === "student") {
        fetchTutors();
    }
  }, [userRole]);

  const handleCardClick = (cardTitle) => {
    // 1. Lựa chọn Tutor: Hiện tất cả
    if (cardTitle === "LỰA CHỌN TUTOR/MENTOR") {
      setFilteredTutors(apiTutors);
      setModalTitle("Danh sách tất cả Tutor/Mentor");
      setIsTutorOpen(true);
    }
    
    // 2. Gợi ý Tutor: Lọc theo Khoa + Có slot
    if (cardTitle === "GỢI Ý TUTOR/MENTOR") {
        if (!myFaculty) {
            alert("Không tìm thấy thông tin Khoa của bạn. Vui lòng đăng nhập lại.");
            return;
        }

        const suggested = apiTutors.filter(t => 
            t.slots > 0 && 
            t.department === myFaculty // So sánh chính xác tên khoa
        );
        
        if (suggested.length === 0) {
            alert(`Không tìm thấy Tutor nào thuộc khoa "${myFaculty}" đang có lịch trống.`);
            return;
        }
        
        setFilteredTutors(suggested);
        setModalTitle(`Gợi ý Tutor khoa ${myFaculty}`);
        setIsTutorOpen(true);
    }
  };

  return (
    <main className="flex-1 px-[106px] py-7">
      <div className="flex mb-8 items-center justify-between">
        <div className="font-playwrite font-normal text-black text-sm">
          Hãy bắt đầu đăng ký! 
        </div>
      </div>

      <CardSection
        cards={studentCards}
        onCardClick={(title) => {
          if (userRole !== "student") {
            alert("Chức năng này chỉ dành cho sinh viên!");
            return;
          }
          handleCardClick(title);
        }}
        columns={3}
      />

      <TutorModal
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        tutorData={filteredTutors}
        // Bạn có thể truyền thêm prop title vào TutorModal nếu muốn hiển thị tiêu đề động
        // Ví dụ sửa TutorModal nhận prop `customTitle`
      />
    </main>
  );
};

export default Register;