import React, { useState, useEffect } from "react";
import { XIcon } from "lucide-react";
import ConfirmModal from "./Confirm/ConfirmModal";
import { getTutorAvailability, createBookingAPI } from "../services/api";

export default function CalendarModal({ isOpen, onClose, tutor }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  // State lưu các slot lấy từ API
  const [slots, setSlots] = useState([]); 

  // Load Availability khi mở modal
  useEffect(() => {
    if (isOpen && tutor) {
        const fetchSlots = async () => {
            try {
                const data = await getTutorAvailability(tutor.id);
                // Map dữ liệu từ Backend sang format hiển thị
                // Backend trả về: { id, start_time, end_time, is_booked }
                const formattedSlots = data.map(item => {
                    const dateObj = new Date(item.start_time);
                    const dateStr = dateObj.toLocaleDateString('vi-VN'); // Ngày: 20/11/2023
                    const timeStr = dateObj.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}); // 09:00
                    
                    // Lấy thứ
                    const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
                    const dayStr = days[dateObj.getDay()];

                    return {
                        id: item.id, // ID thực của slot trong DB
                        day: dayStr,
                        date: dateStr,
                        time: timeStr,
                        week: getWeekNumber(dateObj), // Hàm tính tuần (viết thêm ở dưới hoặc bỏ qua)
                        available: !item.is_booked,
                        booked: item.is_booked ? 1 : 0,
                        maxSlots: 1 // Backend logic 1 slot 1 người
                    };
                });
                setSlots(formattedSlots);
            } catch (err) {
                console.error(err);
            }
        };
        fetchSlots();
    }
  }, [isOpen, tutor]);

  // Hàm tính số tuần (Optional)
  const getWeekNumber = (d) => {
      d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
      var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
      var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
      return weekNo;
  }

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
        // Gọi API Book
        await createBookingAPI(tutor.id, selectedSlot.id, "Sinh viên đăng ký qua web");
        
        alert(`Đăng ký thành công Tutor: ${tutor.name} vào lúc ${selectedSlot.time}`);
        setModalOpen(false);
        onClose(); // Đóng modal lớn sau khi thành công
    } catch (error) {
        alert("Lỗi: " + error.message);
    }
  };

  const handleCloseConfirm = () => setModalOpen(false);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white w-[600px] rounded-2xl shadow-lg p-6 relative">
          <button
            onClick={onClose}
            className="absolute -top-5 -right-5 w-[50px] h-[50px] bg-myred rounded-full shadow-4xl flex items-center justify-center"
          >
            <XIcon className="w-8 h-8 text-white" />
          </button>

          <h2 className="text-primary mb-2 flex gap-4 items-center">
            <span className="text-black font-playwrite">Lịch trống của :</span>
            <div className="text-xl font-bold text-myred">{tutor.name}</div>
          </h2>
          <p className="text-sm text-gray-600 mb-4 ">
            Khoa: {tutor.department}
          </p>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {slots.length === 0 ? <p>Chưa có lịch trống.</p> : slots.map((slot, index) => {
              const remaining = slot.maxSlots - slot.booked;
              return (
                <div
                  key={index}
                  className={`p-5 rounded-xl border flex justify-between items-center 
                    ${slot.available ? "bg-green-50 border-green-300" : "bg-gray-200 border-gray-300"}`}
                >
                  <div>
                    <div className="font-bold text-lg">{slot.day} - Ngày: {slot.date}</div>
                    <div className="text-sm text-gray-600 flex">
                      <span>Tuần {slot.week} </span>
                      <div className="text-primary font-bold px-4">
                        {slot.time}
                      </div>
                    </div>
                  </div>

                  {slot.available && remaining > 0 ? (
                    <button
                      className="px-3 py-1 bg-primary text-white rounded-lg text-sm"
                      onClick={() => {
                        setSelectedSlot(slot);
                        setModalOpen(true);
                      }}
                    >
                      Đăng ký
                    </button>
                  ) : (
                    <span className="text-red-600 font-semibold text-sm">
                      Đã hết
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirm}
        title={
          selectedSlot
            ? `Xác nhận đăng ký Tutor: ${tutor.name} - ${selectedSlot.day} - ngày ${selectedSlot.date} vào lúc ${selectedSlot.time}?`
            : ""
        }
      />
    </>
  );
}