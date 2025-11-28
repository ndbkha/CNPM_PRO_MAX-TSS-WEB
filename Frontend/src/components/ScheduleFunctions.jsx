// // src/components/ScheduleFunctions.jsx
// import React, { useState } from "react";
// import CardSection from "./Card/CardSection";
// import { Calendar, Trash2, Edit, PlusSquare } from "lucide-react";
// import MyAppointment from "../components/MyAppointment/MyAppointment";
// import CreateSlotModal from "./CreateSlotModal"; // Import Modal mới tạo

// // Import các API
// import { 
//     getMyBookingsAPI, 
//     createAvailabilityAPI, 
//     studentRequestCancelAPI, 
//     tutorCancelBookingAPI,
//     studentRequestRescheduleAPI // (Dành cho nâng cao)
// } from "../services/api";

// const sharedCards = [
//   { icon: Calendar, title: "LỊCH CỦA TÔI" },
//   { icon: Trash2, title: "HỦY LỊCH" },
//   { icon: Edit, title: "THAY ĐỔI LỊCH" },
// ];

// const tutorCards = [
//   { icon: PlusSquare, title: "TẠO LỊCH TRỐNG" },
// ];

// const ScheduleFunctions = () => {
//   const userRole = localStorage.getItem("role");
  
//   // State quản lý Modal
//   const [isMyAppointmentOpen, setIsMyAppointmentOpen] = useState(false);
//   const [isCreateSlotOpen, setIsCreateSlotOpen] = useState(false);
  
//   const [appointments, setAppointments] = useState([]);
//   const [viewMode, setViewMode] = useState("view"); // 'view' | 'cancel' | 'reschedule'

//   // --- HÀM 1: Lấy danh sách lịch ---
//   const fetchAppointments = async (mode) => {
//     try {
//         const data = await getMyBookingsAPI();
//         // Map dữ liệu từ Backend sang format hiển thị
//         const mappedData = data.map(item => ({
//             id: item.id, // ID booking thật
//             tutorName: `Mã Tutor: ${item.tutor_id}`, 
//             studentName: `Mã SV: ${item.student_id}`,
//             // Backend chưa trả về ngày giờ cụ thể của slot trong booking object (cần join bảng).
//             // Tạm thời hiển thị Status và ID để demo chức năng.
//             date: "Ngày tạo: " + new Date(item.created_at).toLocaleDateString(), 
//             time: `Slot ID: ${item.slot_id}`,
//             status: item.status,
//             note: item.note
//         }));

//         // Lọc dữ liệu theo mode
//         let filtered = mappedData;
//         if (mode === "cancel" || mode === "reschedule") {
//             // Chỉ hiện những lịch chưa hoàn thành hoặc chưa hủy
//             filtered = mappedData.filter(i => i.status === 'confirmed' || i.status === 'pending');
//         }

//         setAppointments(filtered);
//         setViewMode(mode);
//         setIsMyAppointmentOpen(true);
//     } catch (error) {
//         alert("Lỗi tải lịch: " + error.message);
//     }
//   };

//   // --- HÀM 2: Xử lý Click Card chung ---
//   const handleSharedCardClick = (title) => {
//     if (title === "LỊCH CỦA TÔI") fetchAppointments("view");
//     if (title === "HỦY LỊCH") fetchAppointments("cancel");
    
//     if (title === "THAY ĐỔI LỊCH") {
//         if(userRole !== 'student') {
//             alert("Chỉ sinh viên mới được yêu cầu đổi lịch.");
//             return;
//         }
//         // Logic đổi lịch khá phức tạp (phải chọn lịch cũ -> chọn slot mới).
//         // Ở đây demo hiển thị danh sách để biết flow.
//         fetchAppointments("reschedule");
//     }
//   };

//   // --- HÀM 3: Xử lý Click Card Tutor ---
//   const handleTutorCardClick = (title) => {
//     if (userRole !== "tutor") {
//       alert("Chức năng này chỉ dành cho Tutor!");
//       return;
//     }
//     if (title === "TẠO LỊCH TRỐNG") {
//       setIsCreateSlotOpen(true);
//     }
//   };

//   // --- HÀM 4: Logic tạo Slot (Gọi API) ---
//   const handleCreateSlotConfirm = async (isoDate) => {
//       try {
//           await createAvailabilityAPI(isoDate);
//           alert("Tạo lịch trống thành công!");
//           setIsCreateSlotOpen(false);
//       } catch (error) {
//           alert("Lỗi: " + error.message);
//       }
//   };

//   // --- HÀM 5: Logic Hủy Lịch (Truyền vào MyAppointment) ---
//   const handleCancelAction = async (bookingId) => {
//       if(!window.confirm("Bạn có chắc chắn muốn hủy lịch này?")) return;

//       try {
//           if (userRole === "student") {
//               await studentRequestCancelAPI(bookingId, "Sinh viên yêu cầu hủy");
//               alert("Đã gửi yêu cầu hủy đến Tutor.");
//           } else if (userRole === "tutor") {
//               await tutorCancelBookingAPI(bookingId);
//               alert("Đã hủy lịch thành công.");
//           }
//           // Refresh lại list
//           fetchAppointments(viewMode);
//       } catch (error) {
//           alert("Lỗi hủy lịch: " + error.message);
//       }
//   };

//   return (
//     <main className="flex-1 px-[106px] py-7">
//       <div className="flex mb-8 items-center justify-between">
//         <div className="font-playwrite font-normal text-black text-sm">
//           Quản lý lịch hẹn ({userRole === 'tutor' ? 'Giảng viên' : 'Sinh viên'})
//         </div>
//       </div>

//       <CardSection
//         title="DÙNG CHUNG"
//         cards={sharedCards}
//         columns={3}
//         onCardClick={handleSharedCardClick}
//       />

//       <CardSection
//         title="TUTOR/MENTOR"
//         cards={tutorCards}
//         columns={3}
//         onCardClick={handleTutorCardClick}
//       />

//       {/* Modal danh sách lịch (Xem / Hủy / Đổi) */}
//       <MyAppointment
//         isOpen={isMyAppointmentOpen}
//         onClose={() => setIsMyAppointmentOpen(false)}
//         data={appointments}
//         viewMode={viewMode} 
//         onCancel={handleCancelAction} // Truyền hàm hủy xuống
//       />

//       {/* Modal tạo lịch trống cho Tutor */}
//       <CreateSlotModal 
//         isOpen={isCreateSlotOpen}
//         onClose={() => setIsCreateSlotOpen(false)}
//         onConfirm={handleCreateSlotConfirm}
//       />
//     </main>
//   );
// };

// export default ScheduleFunctions;

import React, { useState } from "react";
import CardSection from "./Card/CardSection";
import { Calendar, Trash2, Edit, PlusSquare } from "lucide-react";

// Import các Modal
import MyAppointment from "../components/MyAppointment/MyAppointment";
import CreateSlotModal from "./CreateSlotModal";

// Import API
import { 
    getMyBookingsAPI, 
    createAvailabilityAPI, 
    studentRequestCancelAPI,
    tutorCancelBookingAPI 
} from "../services/api";

const sharedCards = [
  { icon: Calendar, title: "LỊCH CỦA TÔI" },
  { icon: Trash2, title: "HỦY LỊCH" },
  { icon: Edit, title: "THAY ĐỔI LỊCH" },
];

const tutorCards = [
  { icon: PlusSquare, title: "TẠO LỊCH TRỐNG" },
];

const ScheduleFunctions = () => {
  const userRole = localStorage.getItem("role"); // "student" hoặc "tutor"

  // State
  const [isMyAppointmentOpen, setIsMyAppointmentOpen] = useState(false);
  const [isCreateSlotOpen, setIsCreateSlotOpen] = useState(false);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  // Hàm helper tính tuần (đơn giản hóa)
  const getWeekNumber = (date) => {
      // Logic tính tuần giả định, thực tế dùng date-fns
      const startOfYear = new Date(date.getFullYear(), 0, 1);
      const pastDays = (date - startOfYear) / 86400000;
      return Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
  };

  // 1. Hàm lấy dữ liệu từ API và map vào bảng
  const fetchAndShowAppointments = async (filterType) => {
      try {
          const rawData = await getMyBookingsAPI();
          
          // Map dữ liệu từ Backend format -> Frontend format
          const mappedData = rawData.map((item, index) => {
              const dateObj = new Date(item.created_at); // Lưu ý: Backend cần join để lấy time chính xác của slot. Tạm dùng created_at để demo.
              const days = ['CN', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy'];
              
              return {
                  stt: index + 1,
                  id: item.id,
                  tutor: `ID: ${item.tutor_id}`, // Backend chưa trả tên, tạm hiện ID
                  day: days[dateObj.getDay()],
                  date: dateObj.toLocaleDateString('vi-VN'),
                  week: getWeekNumber(dateObj),
                  time: "Slot " + item.slot_id, // Cần backend join slot để lấy giờ
                  status: item.status,
                  subject: item.note
              };
          });

          // Lọc dữ liệu theo nút bấm
          let result = mappedData;
          if (filterType === "CANCEL_CHANGE") {
              // Chỉ hiện những cái chưa hủy để cho phép hủy/đổi
              result = mappedData.filter(i => i.status === 'confirmed' || i.status === 'pending');
          }

          setFilteredAppointments(result);
          setIsMyAppointmentOpen(true);

      } catch (error) {
          alert("Lỗi tải dữ liệu: " + error.message);
      }
  };

  const handleSharedCardClick = (title) => {
    if (title === "LỊCH CỦA TÔI") {
        fetchAndShowAppointments("ALL");
    }
    if (title === "HỦY LỊCH" || title === "THAY ĐỔI LỊCH") {
        fetchAndShowAppointments("CANCEL_CHANGE");
    }
  };

  const handleTutorCardClick = (title) => {
    if (userRole !== "tutor") {
      alert("Chức năng này chỉ dành cho tutor!");
      return;
    }
    if (title === "TẠO LỊCH TRỐNG") {
      setIsCreateSlotOpen(true);
    }
  };

  // 2. Logic Xử lý Hủy Lịch
  const handleCancelBooking = async (bookingId) => {
      try {
          if (userRole === "student") {
              await studentRequestCancelAPI(bookingId, "Sinh viên hủy qua web");
              alert("Đã gửi yêu cầu hủy thành công!");
          } else {
              await tutorCancelBookingAPI(bookingId);
              alert("Đã hủy lịch thành công!");
          }
          // Refresh lại list sau khi hủy
          setIsMyAppointmentOpen(false); // Đóng modal để user mở lại thấy data mới
      } catch (error) {
          alert("Lỗi hủy lịch: " + error.message);
      }
  };

  // 3. Logic Tạo Lịch Trống (Tutor)
  const handleCreateSlot = async (isoDate) => {
      try {
          await createAvailabilityAPI(isoDate);
          alert("Đã tạo lịch trống thành công!");
          setIsCreateSlotOpen(false);
      } catch (error) {
          alert("Lỗi tạo lịch: " + error.message);
      }
  };

  return (
    <main className="flex-1 px-[106px] py-7">
      <div className="flex mb-8 items-center justify-between">
        <div className="font-playwrite font-normal text-black text-sm">
          Quản lý lịch hẹn
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

      {/* Modal Lịch của tôi */}
      <MyAppointment
        isOpen={isMyAppointmentOpen}
        onClose={() => setIsMyAppointmentOpen(false)}
        data={filteredAppointments}
        onCancelAppointment={handleCancelBooking} // Truyền hàm hủy xuống
      />

      {/* Modal Tạo lịch trống */}
      <CreateSlotModal 
        isOpen={isCreateSlotOpen}
        onClose={() => setIsCreateSlotOpen(false)}
        onConfirm={handleCreateSlot}
      />
    </main>
  );
};

export default ScheduleFunctions;