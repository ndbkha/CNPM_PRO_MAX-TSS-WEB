// MyAppointment.jsx
import { useState } from "react";
import { TableModal } from "../TableModal"; // Đảm bảo đường dẫn import đúng
import AppointmentDetailModal from "./AppointmentDetailModal";

const appointmentColumns = [
  { label: "STT", key: "stt", width: "55px" },
  { label: "Người HD", key: "tutor", color: "#9C050C" }, // Sửa label cho gọn
  { label: "Thứ", key: "day" },
  { label: "Ngày", key: "date" },
  { label: "Tuần", key: "week" },
  { label: "Giờ", key: "time" },
  { label: "Trạng thái", key: "status", color: "#9C050C" },
];

export default function MyAppointment({ isOpen, onClose, data, viewMode, onCancelAppointment, onConfirmAppointment, onChangeAppointment, onDeclineAppointment }) {
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleRowClick = (appointment) => {
    setSelectedAppointment(appointment);
  };

  


  return (
    <>
      <TableModal
        isOpen={isOpen}
        onClose={onClose}
        title={viewMode === 'approve' ? "Duyệt lịch hẹn (Pending)" : "Lịch của tôi"}
        data={data}
        columns={appointmentColumns}
        onRowClick={handleRowClick}
        sidebarContent={
          <>
            <img src="/logo.jpg" className="w-[110px] h-[110px] mb-4" />
            <div className="text-center font-bold text-lg leading-tight">
              LỊCH HẸN <br /> CỦA TÔI
            </div>
          </>
        }
      />

      {selectedAppointment && (
        <AppointmentDetailModal
          isOpen={true}
          onClose={() => setSelectedAppointment(null)}
          appointment={selectedAppointment}
          viewMode={viewMode} // Truyền viewMode xuống
          onCancel={onCancelAppointment}
          onConfirm={onConfirmAppointment} // Truyền hàm Confirm xuống
          onChange={onChangeAppointment} 
          onDecline={onDeclineAppointment} // Truyền hàm Decline xuống
        />
      )}
    </>
  );
}