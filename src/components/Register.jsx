// src/components/Register.jsx
import React, { useState } from "react";
import TutorModal from "./TutorModal"; // modal hiển thị danh sách tutor
import tutorData from "../mockdata/tutorData"; // dữ liệu mock tutor

const registerCards = [
  {
    icon: "https://c.animaapp.com/mig5whntbIbmXx/img/signing-a-document.png",
    title: "LỰA CHỌN TUTOR/MENTOR",
  },
  {
    icon: "https://c.animaapp.com/mig5whntbIbmXx/img/books.png",
    title: "GỢI Ý TUTOR/MENTOR",
  },
];

const Register = () => {
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
      // Chỉ gợi ý tutor cùng khoa hoặc đã đăng ký
      const filtered = tutorData.filter(
        (tutor) =>
          tutor.department === userDepartment ||
          tutorsRegistered.includes(tutor.name)
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

      {/* Cards lựa chọn */}
      <section className="mb-[31px]">
        <div className="grid grid-cols-3 gap-4">
          {registerCards.map((card, index) => (
            <button
              key={index}
              className="flex overflow-hidden rounded-[10px] border-0 shadow-none h-[140px] hover:opacity-75"
              onClick={() => handleCardClick(card.title)}
            >
              <div className="flex p-0 w-full">
                <div className="w-[141px] bg-white rounded-[10px_0px_0px_10px] border-[3px] border-solid border-primary flex items-center justify-center">
                  <img className="w-[90px] h-[90px]" alt={card.title} src={card.icon} />
                </div>
                <div className="flex-1 bg-primary flex items-center justify-center rounded-[0px_10px_10px_0px]">
                  <h3 className="font-extrabold text-white text-[26px] text-center px-4">
                    {card.title}
                  </h3>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

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
