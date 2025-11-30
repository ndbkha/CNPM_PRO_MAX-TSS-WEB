// export default ScheduleFunctions;

import React, { useState } from "react";
import CardSection from "./Card/CardSection";
import { Calendar, Trash2, Edit, PlusSquare, CheckCircle } from "lucide-react";

// Import các Modal
import MyAppointment from "../components/MyAppointment/MyAppointment";
import CreateSlotModal from "./CreateSlotModal";

// Import API
import {
  getMyBookingsAPI,
  createAvailabilityAPI,
  studentRequestCancelAPI,
  tutorCancelBookingAPI,
  confirmBookingAPI,
  requestRescheduleAPI,
} from "../services/api";

import CalendarModal from "./CalendarModal"; // Import CalendarModal

const sharedCards = [
  { icon: Calendar, title: "LỊCH CỦA TÔI" },
  { icon: Trash2, title: "HỦY LỊCH" },
  { icon: Edit, title: "THAY ĐỔI LỊCH" },
];

const tutorCards = [
  { icon: PlusSquare, title: "TẠO LỊCH TRỐNG" },
  { icon: CheckCircle, title: "DUYỆT LỊCH HẸN" },
];

const ScheduleFunctions = () => {
  const userRole = localStorage.getItem("role"); // "student" hoặc "tutor"

  // State
  const [isMyAppointmentOpen, setIsMyAppointmentOpen] = useState(false);
  const [isCreateSlotOpen, setIsCreateSlotOpen] = useState(false);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [viewMode, setViewMode] = useState("view");

  // State phục vụ đổi lịch
  const [isRescheduleCalendarOpen, setIsRescheduleCalendarOpen] = useState(false);
  const [targetBookingForReschedule, setTargetBookingForReschedule] = useState(null); // Lưu booking đang muốn đổi
  const [currentTutorForReschedule, setCurrentTutorForReschedule] = useState(null); // Lưu thông tin Tutor để hiển thị Calendar

  // Hàm helper tính tuần (đơn giản hóa)
  const getWeekNumber = (date) => {
    // Logic tính tuần giả định, thực tế dùng date-fns
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDays = (date - startOfYear) / 86400000;
    return Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
  };

  // 1. Hàm lấy dữ liệu
  const fetchAndShowAppointments = async (filterType) => {
    try {
      const rawData = await getMyBookingsAPI();

      // Map data (Giữ nguyên logic map cũ của bạn)
      const mappedData = rawData.map((item, index) => {
        const dateObj = new Date(item.created_at);
        const days = ['CN', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy'];

        let displayDate = "Chưa cập nhật";
        let displayTime = "Chưa cập nhật";
        let dayOfWeek = "";

        if (item.slot && item.slot.start_time) {
          const slotDate = new Date(item.slot.start_time);

          // Lấy ngày: dd/mm/yyyy
          displayDate = slotDate.toLocaleDateString('vi-VN');

          // Lấy giờ: HH:mm
          displayTime = slotDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

          // Lấy thứ
          const days = ['CN', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy'];
          dayOfWeek = days[slotDate.getDay()];
        }


        let displayPersonName = "Không xác định";
        if (userRole === "student") {
          displayPersonName = item.tutor ? item.tutor.full_name : `Tutor ID: ${item.tutor_id}`;
        } else {
          displayPersonName = item.student ? item.student.full_name : `SV ID: ${item.student_id}`;
        }

        return {
          stt: index + 1,
          id: item.id,
          rawTutorId: item.tutor_id, // ID thật của Tutor (số nguyên)
          tutorNameFull: item.tutor ? item.tutor.full_name : "Giảng viên", // Tên thật
          tutorDept: item.tutor ? item.tutor.faculty : "...", // Khoa
          tutor: displayPersonName,
          studentId: item.student_id, // Lưu thêm studentId để hiển thị
          day: days[dateObj.getDay()],
          date: dateObj.toLocaleDateString('vi-VN'),
          week: 1, // Logic tính tuần
          time: displayTime,
          status: item.status,
          subject: item.note
        };
      });

      // Lọc dữ liệu theo nút bấm
      let result = mappedData;

      if (filterType === "APPROVE") {
        // Chỉ hiện các lịch đang chờ duyệt (pending)
        result = mappedData.filter(i => i.status === 'pending');
        setViewMode("approve"); // Set mode để hiển thị nút Duyệt
      } else if (filterType === "CANCEL") {
        result = mappedData.filter(i => i.status === 'confirmed' || i.status === 'pending');
        setViewMode("cancel");
      } else {
        setViewMode("view");
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
    // Xử lý khi bấm nút Duyệt
    if (title === "DUYỆT LỊCH HẸN") {
      fetchAndShowAppointments("APPROVE");
    }
  };

  // 2. Logic Xử lý Xác nhận (Duyệt)
  const handleConfirmBooking = async (bookingId) => {
    try {
      await confirmBookingAPI(bookingId);
      alert("Đã duyệt lịch thành công!");
      // Refresh lại danh sách (vẫn ở chế độ APPROVE để duyệt tiếp cái khác)
      fetchAndShowAppointments("APPROVE");
    } catch (error) {
      alert("Lỗi duyệt lịch: " + error.message);
    }
  };

  const handleDeclineBooking = async (bookingId) => {
      if (!window.confirm("Bạn có chắc chắn muốn TỪ CHỐI lịch hẹn này?")) return;

      try {
          // Gọi API hủy lịch của Tutor (bản chất Từ chối = Hủy)
          await tutorCancelBookingAPI(bookingId);
          alert("Đã từ chối lịch hẹn. Slot này đã được mở lại.");
          
          setIsMyAppointmentOpen(false); // Đóng modal
          fetchAndShowAppointments("APPROVE"); // Load lại danh sách chờ duyệt
      } catch (error) {
          alert("Lỗi thao tác: " + error.message);
      }
  };

  // 2. Logic Xử lý Hủy Lịch
  const handleCancelBooking = async (bookingId) => {
    // Tìm booking hiện tại để kiểm tra trạng thái trước khi gọi API
    const currentBooking = filteredAppointments.find(item => item.id === bookingId);
    const isPending = currentBooking?.status === 'pending';

    try {
      if (userRole === "student") {
        await studentRequestCancelAPI(bookingId, "Hủy qua web");

        // Thông báo dựa trên trạng thái cũ
        if (isPending) {
          alert("Lịch hẹn chưa được duyệt nên đã HỦY NGAY lập tức.");
        } else {
          alert("Đã gửi yêu cầu hủy! Vui lòng chờ Tutor xác nhận.");
        }
      } else {
        // Logic Tutor hủy
        await tutorCancelBookingAPI(bookingId);
        alert("Đã hủy lịch thành công!");
      }

      // Refresh lại list và đóng modal
      setIsMyAppointmentOpen(false);
      // Gọi lại hàm load dữ liệu để cập nhật bảng ngay lập tức
      fetchAndShowAppointments(viewMode === 'approve' ? "APPROVE" : (viewMode === 'cancel' ? "CANCEL" : "ALL"));

    } catch (error) {
      alert("Lỗi thao tác: " + error.message);
    }
  };
  // 3. Logic Tạo Lịch Trống (Tutor)
  const handleCreateSlot = async (isoDate) => {
    try {
      await createAvailabilityAPI(isoDate);
      alert("Đã tạo lịch trống thành công!");
      // setIsCreateSlotOpen(false);
    } catch (error) {
      alert("Lỗi tạo lịch: " + error.message);
    }
  };

  // Xử lý khi bấm nút "Thay đổi lịch" ở Modal Chi tiết
  const handleChangeSchedule = (booking) => {
      setTargetBookingForReschedule(booking);
      
      // FIX LỖI ID NAN: Dùng rawTutorId lấy từ bước fetchAndShowAppointments
      if (!booking.rawTutorId) {
          alert("Không tìm thấy thông tin Tutor.");
          return;
      }

      setCurrentTutorForReschedule({
          id: booking.rawTutorId,       // ID số nguyên chuẩn
          name: booking.tutorNameFull,  // Tên đầy đủ
          department: booking.tutorDept // Khoa
      });

      // Mở modal Calendar để chọn slot mới
      setIsRescheduleCalendarOpen(true);
  };


  // Logic gọi API đổi lịch (truyền vào CalendarModal)
  const executeReschedule = async (newSlotId) => {
    try {
      if (!targetBookingForReschedule) return;

      await requestRescheduleAPI(
        targetBookingForReschedule.id, // ID booking cũ
        newSlotId,                     // ID slot mới
        "Sinh viên đổi lịch"
      );

      alert("Đã gửi yêu cầu đổi lịch thành công! Vui lòng chờ Tutor xác nhận.");
      setIsRescheduleCalendarOpen(false); // Đóng calendar
      fetchAndShowAppointments("ALL");    // Refresh danh sách
    } catch (error) {
      alert("Lỗi đổi lịch: " + error.message);
    }
  };


  return (
    <main className="flex-1 px-[106px] py-7">
      <div className="flex mb-8 items-center justify-between">
        <div className="font-playwrite font-normal text-black text-sm">
          Quản lý lịch hẹn
        </div>
      </div>


      <CardSection title="DÙNG CHUNG" cards={sharedCards} columns={3} onCardClick={(title) => {
        if (title === "LỊCH CỦA TÔI") fetchAndShowAppointments("ALL");
        if (title === "HỦY LỊCH") fetchAndShowAppointments("CANCEL");
        if (title === "THAY ĐỔI LỊCH") fetchAndShowAppointments("CHANGE");
      }} />

      <CardSection title="TUTOR/MENTOR" cards={tutorCards} columns={3} onCardClick={handleTutorCardClick} />

      {/* Modal Lịch của tôi */}
      <MyAppointment
        isOpen={isMyAppointmentOpen}
        onClose={() => setIsMyAppointmentOpen(false)}
        data={filteredAppointments}
        viewMode={viewMode} // Truyền viewMode xuống ('approve', 'cancel', 'view')
        onCancelAppointment={handleCancelBooking}
        onConfirmAppointment={handleConfirmBooking} // Truyền hàm duyệt xuống
        onChangeAppointment={handleChangeSchedule}
        onDeclineAppointment={handleDeclineBooking} // Truyền hàm từ chối xuống 
      />

      {/* Modal Calendar dành riêng cho việc Đổi Lịch */}
      {isRescheduleCalendarOpen && currentTutorForReschedule && (
        <CalendarModal
          isOpen={true}
          onClose={() => setIsRescheduleCalendarOpen(false)}
          tutor={currentTutorForReschedule}

          // QUAN TRỌNG: Truyền hàm xử lý đổi lịch vào đây
          customOnConfirm={executeReschedule}
          title="Chọn lịch mới để thay đổi"
        />
      )}



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