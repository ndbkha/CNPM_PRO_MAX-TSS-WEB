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
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  
  // State lưu danh sách tutor lấy từ API
  const [apiTutors, setApiTutors] = useState([]); 
  const [filteredTutors, setFilteredTutors] = useState([]);

  // Load Tutor từ Backend khi vào trang
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const data = await getTutorsAPI();
        // Map dữ liệu từ Backend sang format của TableModal
        const formattedData = data.map((item, index) => ({
            stt: index + 1,
            id: item.id,
            name: item.full_name,
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
    if (cardTitle === "LỰA CHỌN TUTOR/MENTOR") {
      setFilteredTutors(apiTutors);
      setIsTutorOpen(true);
    }
    // Logic gợi ý (giữ nguyên hoặc tùy chỉnh sau)
    if (cardTitle === "GỢI Ý TUTOR/MENTOR") {
        const suggested = apiTutors.filter(t => t.slots > 0);
        setFilteredTutors(suggested);
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
      />
    </main>
  );
};

export default Register;
