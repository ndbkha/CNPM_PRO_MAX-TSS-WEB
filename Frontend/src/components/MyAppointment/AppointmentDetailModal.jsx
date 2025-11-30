// src/components/MyAppointment/AppointmentDetailModal.jsx
import React from "react";
// Nếu bạn có dùng date-fns thì import, không thì thôi
// import { differenceInHours, parse, parseISO, format } from "date-fns";

// CHÚ Ý: Phải thêm viewMode và onConfirm vào đây 👇
function AppointmentDetailModal({ isOpen, onClose, appointment, viewMode, onCancel, onConfirm, onChange, onDecline }) {
  if (!isOpen) return null;

  const statusMap = {
    pending: "Đang chờ",
    confirmed: "Đã xác nhận",
    completed: "Đã diễn ra",
    cancelled: "Đã hủy",
    cancel_requested: "Yêu cầu hủy"
  };

  const statusVietnamese = statusMap[appointment?.status] || appointment?.status;

  const handleConfirmClick = () => {
    if (onConfirm) {
        onConfirm(appointment.id);
        onClose();
    }
  };

  const handleDeclineClick = () => { 
      // console.log("Nút từ chối đã được bấm!"); // <--- Thêm dòng này để debug
      // console.log("Hàm onDecline là:", onDecline); // <--- Kiểm tra xem có nhận được hàm không

    if (onDecline) { 
        onDecline(appointment.id); 
        onClose(); 
    } 
  };  
  
 
  


  const handleCancelClick = () => {
    if (window.confirm("Bạn có chắc chắn muốn hủy lịch này?")) {
        if (onCancel) onCancel(appointment.id);
        onClose();
    }
  };

  const handleChangeClick = () => {
      // Gọi hàm onChange truyền từ cha xuống
      if (onChange) {
          onChange(appointment); // Truyền nguyên object appointment để biết đang đổi cái nào
      }
      onClose(); // Đóng modal chi tiết này lại
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[480px] shadow-lg relative">
        <h2 className="text-xl font-bold text-primary">
            {viewMode === 'approve' ? "Duyệt yêu cầu đặt lịch" : "Chi tiết lịch hẹn"}
        </h2>
        <div className="bg-secondary h-0.5 w-full my-3"></div>

        <div className="space-y-2 text-sm">
          <p><strong>Mã số:</strong> #{appointment.id}</p>
          <p><strong>Tutor/Student:</strong> {appointment.tutor || appointment.studentId}</p>
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

        {viewMode === 'approve' && (
            <div className="mb-4 p-2 bg-yellow-50 text-yellow-800 text-xs rounded border border-yellow-200">
                Lịch này đang chờ bạn xác nhận.
            </div>
        )}

        <div className="flex justify-between mt-6 font-bold text-sm">
          
          {/* LOGIC HIỂN THỊ NÚT KHI DUYỆT */}
          {viewMode === 'approve' && appointment.status === 'pending' && (
              <>
                  <button 
                    className="px-5 py-2 text-white bg-green-600 rounded hover:bg-green-700" 
                    onClick={handleConfirmClick}
                  >
                    Duyệt
                  </button>
                  
                  {/* Nút TỪ CHỐI mới thêm */}
                  <button 
                    className="px-5 py-2 text-white bg-red-600 rounded hover:bg-red-700 ml-2" 
                    onClick={handleDeclineClick}
                  >
                    Từ chối
                  </button>
              </>
          )}

          {/* LOGIC HIỂN THỊ NÚT KHI SINH VIÊN XEM (Giữ nguyên) */}
          {viewMode !== 'approve' && appointment.status !== 'cancelled' && (
              <>
                <button className="px-4 py-2 text-white bg-myred rounded hover:opacity-80" onClick={handleCancelClick}>Hủy lịch</button>
                <button className="px-4 py-2 text-white bg-primary rounded hover:opacity-80 ml-2" onClick={handleChangeClick}>Đổi lịch</button>
              </>
          )}

          <button onClick={onClose} className="px-4 py-2 text-primary bg-secondary rounded ml-auto">Đóng</button>
        </div>
      </div>
    </div>
  );
}

export default AppointmentDetailModal;