// src/components/CreateSlotModal.jsx
import React, { useState, useEffect } from "react";
import { X, RefreshCw, Calendar, Clock } from "lucide-react";
import { getTutorSelfAvailabilityAPI } from "../services/api";

export default function CreateSlotModal({ isOpen, onClose, onConfirm }) {
  const [dateTime, setDateTime] = useState("");
  const [mySlots, setMySlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hàm load danh sách slot của Tutor
  const fetchMySlots = async () => {
    try {
      setLoading(true);
      const data = await getTutorSelfAvailabilityAPI();
      
      // Sắp xếp slot mới nhất lên đầu
      const sortedData = data.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
      setMySlots(sortedData);
    } catch (error) {
      console.error("Lỗi tải lịch:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load dữ liệu khi Modal mở
  useEffect(() => {
    if (isOpen) {
      fetchMySlots();
      setDateTime(""); // Reset form input
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!dateTime) {
      alert("Vui lòng chọn thời gian!");
      return;
    }
    const isoDate = new Date(dateTime).toISOString();
    
    // Gọi hàm onConfirm (đã có logic gọi API tạo trong ScheduleFunctions)
    // Lưu ý: Chúng ta cần chờ nó tạo xong để reload lại list
    await onConfirm(isoDate); 
    
    // Sau khi tạo xong, load lại danh sách
    fetchMySlots();
    setDateTime("");
  };

  // Format ngày giờ hiển thị
  const formatTime = (isoString) => {
    const d = new Date(isoString);
    return {
      date: d.toLocaleDateString('vi-VN'),
      time: d.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}),
      full: d
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      {/* Tăng độ rộng Modal lên 900px để chứa 2 cột */}
      <div className="bg-white rounded-xl shadow-2xl w-[900px] h-[550px] flex overflow-hidden relative animate-fade-in">
        
        {/* Nút đóng */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 z-10"
        >
          <X size={28} />
        </button>

        {/* CỘT TRÁI: FORM TẠO LỊCH */}
        <div className="w-1/3 bg-gray-50 p-8 border-r border-gray-200 flex flex-col">
          <h2 className="text-xl font-bold text-myred mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6" /> Tạo Lịch Mới
          </h2>
          
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Thời gian bắt đầu:
            </label>
            <input 
              type="datetime-local"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-myred/50 shadow-sm"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-3 italic leading-relaxed">
              * Hệ thống tự động tạo slot kéo dài <b>2 tiếng</b> kể từ giờ bắt đầu.
              <br/>* Không được tạo trùng với lịch đã có.
            </p>
          </div>

          <button 
            onClick={handleSubmit} 
            className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-900 transition-colors shadow-md"
          >
            Xác nhận tạo
          </button>
        </div>

        {/* CỘT PHẢI: DANH SÁCH LỊCH ĐÃ TẠO */}
        <div className="w-2/3 p-8 flex flex-col bg-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Danh sách Slot đã mở</h2>
            <button 
              onClick={fetchMySlots} 
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
              title="Làm mới"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Bảng danh sách - Có scroll */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {mySlots.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Calendar size={48} className="mb-2 opacity-50"/>
                <p>Bạn chưa tạo lịch trống nào.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {mySlots.map((slot) => {
                  const { date, time } = formatTime(slot.start_time);
                  const isBooked = slot.is_booked;
                  const isExpired = slot.is_expired; // Backend cần có cột này (như đã làm ở các bước trước)

                  return (
                    <div 
                      key={slot.id} 
                      className={`p-4 rounded-lg border flex justify-between items-center transition-all hover:shadow-md
                        ${isBooked 
                          ? "bg-green-50 border-green-200"  // Đã book: Xanh (có SV đăng ký là vui)
                          : isExpired 
                            ? "bg-gray-100 border-gray-200 opacity-60" // Hết hạn: Xám
                            : "bg-white border-gray-300" // Trống: Trắng
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-2 rounded-lg text-primary">
                            <Clock size={20}/>
                        </div>
                        <div>
                          <div className="font-bold text-gray-800">{date}</div>
                          <div className="text-sm font-semibold text-primary">{time} (2h)</div>
                        </div>
                      </div>

                      {/* Badge Trạng Thái */}
                      <div>
                        {isBooked ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-300">
                            Đã có SV đặt
                          </span>
                        ) : isExpired ? (
                          <span className="px-3 py-1 bg-gray-200 text-gray-500 text-xs font-bold rounded-full">
                            Đã hết hạn
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full border border-yellow-300">
                            Đang trống
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
























// // src/components/CreateSlotModal.jsx
// import React, { useState } from "react";
// import { X } from "lucide-react";

// export default function CreateSlotModal({ isOpen, onClose, onConfirm }) {
//   const [dateTime, setDateTime] = useState("");

//   if (!isOpen) return null;

//   const handleSubmit = () => {
//     if (!dateTime) {
//       alert("Vui lòng chọn thời gian!");
//       return;
//     }
//     // Chuyển format sang ISO string mà backend cần
//     const isoDate = new Date(dateTime).toISOString();
//     onConfirm(isoDate);
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
//       <div className="bg-white rounded-lg p-6 w-[400px] relative shadow-xl">
//         <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
//           <X size={24} />
//         </button>
        
//         <h2 className="text-xl font-bold mb-4 text-myred">Tạo lịch trống (Tutor)</h2>
        
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-2">Thời gian bắt đầu:</label>
//           <input 
//             type="datetime-local"
//             className="w-full border p-2 rounded focus:outline-myred"
//             value={dateTime}
//             onChange={(e) => setDateTime(e.target.value)}
//           />
//           <p className="text-xs text-gray-500 mt-2 italic">*Một slot kéo dài 2 tiếng</p>
//         </div>

//         <div className="flex justify-end gap-2 mt-6">
//           <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
//             Hủy
//           </button>
//           <button onClick={handleSubmit} className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-900">
//             Tạo lịch
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
