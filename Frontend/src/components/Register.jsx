// src/components/Register.jsx
import React, { useState } from "react";
import TutorModal from "./TutorModal"; // modal hiển thị danh sách tutor
import tutorData from "../mockdata/tutorData"; // dữ liệu mock tutor
import CardSection from "./Card/CardSection";
import { UserCheck, Users } from "lucide-react";

const studentCards = [
  {
    icon: UserCheck,
    title: "LỰA CHỌN TUTOR/MENTOR",
  },
  {
    icon: Users,
    title: "GỢI Ý TUTOR/MENTOR",
  },
];


const Register = () => {
  const userRole = localStorage.getItem("role"); // "student" hoặc "tutor"

  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [filteredTutors, setFilteredTutors] = useState([]);

  // Giả sử thông tin student
  const userDepartment = "KH&KT Máy tính"; // khoa của student
  const tutorsRegistered = ["Mai Đức Trung", "Trần Ngọc Diễm"]; // tutor student đã đăng ký

  const handleCardClick = (cardTitle) => {
    if (cardTitle === "LỰA CHỌN TUTOR/MENTOR") {
      setFilteredTutors(tutorData); // hiển thị toàn bộ tutor
      setIsTutorOpen(true);
    }

    if (cardTitle === "GỢI Ý TUTOR/MENTOR") {
      // Chỉ gợi ý tutor cùng khoa hoặc đã đăng ký và còn slot trống
      const filtered = tutorData.filter(
        (tutor) =>
          (tutor.department === userDepartment || tutorsRegistered.includes(tutor.name)) &&
          tutor.slots > 0 // chỉ lấy tutor còn slot
      );
      setFilteredTutors(filtered);
      setIsTutorOpen(true);
    }

  };

  return (
    <main className="flex-1 px-[106px] py-7">
      <div className="flex mb-8 items-center justify-between">
        <div className="font-playwrite font-normal text-black text-sm">
          Hãy bắt đầu đăng ký!
        </div>
        <div className="flex bg-secondary px-8 py-2 rounded-lg items-center justify-between">
          <span className="text-primary font-bold">Số buổi tư vấn đã đăng ký:</span>
          <span className="text-myred font-extrabold ml-2">13</span>
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

      {/* Modal Tutor */}
      <TutorModal
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        tutorData={filteredTutors}
      />
    </main>
  );
};

export default Register;
