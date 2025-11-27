import React, { useState } from "react";
import CardSection from "./Card/CardSection";
import { Calendar, Trash2, Edit, PlusSquare } from "lucide-react";

import MyAppointment from "../components/MyAppointment/MyAppointment";
import myAppointments from "../mockdata/myAppointments";

const sharedCards = [
  { icon: Calendar, title: "LỊCH CỦA TÔI" },
  { icon: Trash2, title: "HỦY LỊCH" },
  { icon: Edit, title: "THAY ĐỔI LỊCH" },
];

const tutorCards = [
  { icon: PlusSquare, title: "TẠO LỊCH TRỐNG" },
];

const ScheduleFunctions = () => {
  const userRole = localStorage.getItem("role");

  const [isMyAppointmentOpen, setIsMyAppointmentOpen] = useState(false);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const handleSharedCardClick = (title) => {

    // 1. LỊCH CỦA TÔI → hiển thị tất cả lịch
    if (title === "LỊCH CỦA TÔI") {
      setFilteredAppointments(myAppointments); 
      setIsMyAppointmentOpen(true);
    }

    // 2. HỦY LỊCH → chỉ hiển thị lịch chưa hoàn thành
    if (title === "HỦY LỊCH") {
      const waitingList = myAppointments.filter(
        (item) => item.status !== "completed" && item.status !== "cancelled"
      );

      if (waitingList.length === 0) {
        alert("Không có lịch nào để hủy.");
        return;
      }

      setFilteredAppointments(waitingList);
      setIsMyAppointmentOpen(true);
    }

    // 3. THAY ĐỔI LỊCH → logic tương tự HỦY LỊCH
    if (title === "THAY ĐỔI LỊCH") {
      const editableList = myAppointments.filter(
        (item) => item.status !== "completed" && item.status !== "cancelled"
      );

      if (editableList.length === 0) {
        alert("Không có lịch nào để thay đổi.");
        return;
      }

      setFilteredAppointments(editableList);
      setIsMyAppointmentOpen(true);
    }
  };

  const handleTutorCardClick = (title) => {
    if (userRole !== "tutor") {
      alert("Chức năng này chỉ dành cho tutor/mentor!");
      return;
    }

    if (title === "TẠO LỊCH TRỐNG") {
      alert("Mở modal tạo lịch trống!");
    }
  };

  return (
    <main className="flex-1 px-[106px] py-7">
      <div className="flex mb-8 items-center justify-between">
        <div className="font-playwrite font-normal text-black text-sm">
          Lịch của bạn.
        </div>
      </div>

      <CardSection
        title="DÙNG CHUNG"
        cards={sharedCards}
        columns={3}
        onCardClick={handleSharedCardClick}
      />

      <CardSection
        title="TUTOR/MENTOR"
        cards={tutorCards}
        columns={3}
        onCardClick={handleTutorCardClick}
      />

      {/* Modal lịch của tôi */}
      <MyAppointment
        isOpen={isMyAppointmentOpen}
        onClose={() => setIsMyAppointmentOpen(false)}
        data={filteredAppointments}
      />
    </main>
  );
};

export default ScheduleFunctions;
