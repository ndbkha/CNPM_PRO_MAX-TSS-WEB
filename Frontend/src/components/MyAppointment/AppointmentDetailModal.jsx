// AppointmentDetailModal.jsx
import React, { useState } from "react";
import { differenceInHours, parse, parseISO, format } from "date-fns";
import CalendarModal from "../CalendarModal";

function AppointmentDetailModal({ isOpen, onClose, appointment, onCancel, onUpdate }) {
  const [showCalendar, setShowCalendar] = useState(false);

  // Map trạng thái sang tiếng Việt
  const statusMap = {
    pending: "Đang chờ",
    confirmed: "Đã xác nhận",
    completed: "Đã diễn ra",
    canceled: "Đã hủy",
  };

  const statusVietnamese =
    statusMap[appointment?.status] || appointment?.status || "";

  // Hủy lịch
  const handleCancel = () => {
    // Chuyển đổi date từ YYYY-MM-DD sang dd/MM/yyyy nếu cần
    let formattedDate = appointment.date;
    if (appointment.date.includes('-')) {
      // Giả sử YYYY-MM-DD
      const isoDate = parseISO(appointment.date);
      formattedDate = format(isoDate, "dd/MM/yyyy");
    }
    const timeStart = appointment.time.split(" - ")[0];
    const appointmentDateTime = parse(
      `${formattedDate} ${timeStart}`,
      "dd/MM/yyyy HH:mm",
      new Date()
    );
    const hoursLeft = differenceInHours(appointmentDateTime, new Date());

    if (hoursLeft < 24) {
      alert("Không thể hủy lịch vì còn dưới 24 giờ.");
      return;
    }

    if (onCancel) onCancel(appointment);
    alert("Lịch đã được hủy!");
    onClose();
  };


  return (
    <>
      {/* Modal chi tiết lịch */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-[480px] shadow-lg relative">
          <h2 className="text-xl font-bold text-primary">Chi tiết lịch hẹn</h2>
          <div className="bg-secondary h-0.5 w-full my-3"></div>

          <div className="space-y-2 text-sm">
            <p>
              <strong>Tutor:</strong> {appointment.tutor}
            </p>
            <div className="flex items-center">
              <p className="mr-24">
                <strong>Thứ:</strong> {appointment.day}
              </p>
              <p>
                <strong>Tuần:</strong> {appointment.week}
              </p>
            </div>
            <div className="flex items-center">
              <p className="mr-14">
                <strong>Ngày:</strong> {appointment.date}
              </p>
              <p>
                <strong>Thời gian:</strong> {appointment.time}
              </p>
            </div>
            <p>
              <strong>Trạng thái:</strong> {statusVietnamese}
            </p>
            <p>
              <strong>Nội dung:</strong> {appointment.subject}
            </p>
          </div>

          <div className="bg-secondary h-0.5 w-full my-3"></div>

          <div className="flex justify-between mt-6 font-bold">
            <button
              className="px-6 py-2 text-white bg-primary rounded-md hover:opacity-75"
              onClick={handleCancel}
            >
              Hủy lịch
            </button>

            <button
              className="px-6 py-2 text-white bg-primary rounded-md hover:opacity-75"
            >
              Thay đổi lịch
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 text-primary bg-secondary rounded-md"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AppointmentDetailModal;