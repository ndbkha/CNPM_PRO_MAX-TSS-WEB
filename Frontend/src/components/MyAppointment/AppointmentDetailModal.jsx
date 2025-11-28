// AppointmentDetailModal.jsx
import React from "react";
import { differenceInHours, parse, parseISO, format } from "date-fns";

function AppointmentDetailModal({ isOpen, onClose, appointment, onCancel, onUpdate }) {
  if (!isOpen) return null;

  const statusMap = {
    pending: "Đang chờ",
    confirmed: "Đã xác nhận",
    completed: "Đã diễn ra",
    cancelled: "Đã hủy",
    cancel_requested: "Yêu cầu hủy"
  };

  const statusVietnamese = statusMap[appointment?.status] || appointment?.status;

  // Xử lý Hủy lịch
  const handleCancelClick = () => {
    // 1. Kiểm tra logic 24h (nếu cần)
    // Lưu ý: format date của bạn cần chuẩn để parse. 
    // Tạm thời bỏ qua check 24h client-side để test API trước, hoặc giữ nguyên nếu date string chuẩn.
    
    if (window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này?")) {
        // Gọi hàm onCancel từ props (sẽ gọi API ở component cha)
        onCancel(appointment.id); 
        onClose();
    }
  };
  
  // Xử lý Thay đổi lịch
  const handleChangeClick = () => {
      alert("Tính năng đang phát triển: Vui lòng hủy lịch cũ và đặt lại lịch mới.");
      // Hoặc gọi onUpdate(appointment) để mở modal chọn lịch khác
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[480px] shadow-lg relative">
        <h2 className="text-xl font-bold text-primary">Chi tiết lịch hẹn</h2>
        <div className="bg-secondary h-0.5 w-full my-3"></div>

        <div className="space-y-2 text-sm">
          <p><strong>Mã số:</strong> #{appointment.id}</p>
          <p><strong>Người hướng dẫn:</strong> {appointment.tutor}</p>
          <div className="flex items-center">
             <p className="mr-24"><strong>Thứ:</strong> {appointment.day}</p>
             <p><strong>Tuần:</strong> {appointment.week}</p>
          </div>
          <div className="flex items-center">
             <p className="mr-14"><strong>Ngày:</strong> {appointment.date}</p>
             <p><strong>Giờ:</strong> {appointment.time}</p>
          </div>
          <p>
            <strong>Trạng thái:</strong> 
            <span className={`ml-2 font-bold ${appointment.status === 'confirmed' ? 'text-green-600' : 'text-red-600'}`}>
                {statusVietnamese}
            </span>
          </p>
          <p><strong>Ghi chú:</strong> {appointment.subject || "Không có"}</p>
        </div>

        <div className="bg-secondary h-0.5 w-full my-3"></div>

        <div className="flex justify-between mt-6 font-bold text-sm">
          {/* Chỉ hiện nút Hủy nếu chưa hủy */}
          {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
              <>
                  <button
                    className="px-4 py-2 text-white bg-myred rounded-md hover:opacity-80"
                    onClick={handleCancelClick}
                  >
                    Hủy lịch
                  </button>

                  <button
                    className="px-4 py-2 text-white bg-primary rounded-md hover:opacity-80"
                    onClick={handleChangeClick}
                  >
                    Thay đổi lịch
                  </button>
              </>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 text-primary bg-secondary rounded-md ml-auto"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppointmentDetailModal;