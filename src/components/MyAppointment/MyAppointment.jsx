import { useState } from "react";
import { TableModal } from "../TableModal";
import AppointmentDetailModal from "./AppointmentDetailModal";

const appointmentColumns = [
  { label: "STT", key: "stt", width: "55px" },
  { label: "Tutor", key: "tutor", color: "#9C050C" },
  { label: "Thứ", key: "day" },
  { label: "Ngày", key: "date" },
  { label: "Tuần", key: "week" },
  { label: "Giờ", key: "time" },
  { label: "Trạng thái", key: "status", color: "#9C050C" },
];

export default function MyAppointment({ isOpen, onClose, data }) {
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleRowClick = (appointment) => {
    setSelectedAppointment(appointment);
  };

  return (
    <>
      <TableModal
        isOpen={isOpen}
        onClose={onClose}
        title="Lịch của tôi"
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
        />
      )}
    </>
  );
}
