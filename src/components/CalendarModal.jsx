// CalendarModal.js
import React, { useState } from "react";
import { XIcon } from "lucide-react";
import tutorSlots from "../mockdata/tutorSlots";
import ConfirmModal from "./Confirm/ConfirmModal";

export default function CalendarModal({ isOpen, onClose, tutor }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  if (!isOpen) return null;

  const slots = tutorSlots[tutor.id] || [];

  const handleConfirm = () => {
    alert(`Đăng ký thành công Tutor: ${tutor.name} - ${selectedSlot.day} - ngày ${selectedSlot.date} vào lúc ${selectedSlot.time}`);
    setModalOpen(false);
  };

  const handleCloseConfirm = () => setModalOpen(false);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white w-[600px] rounded-2xl shadow-lg p-6 relative">
          {/* Nút X */}
          <button
            onClick={onClose}
            className="absolute -top-5 -right-5 w-[50px] h-[50px] bg-myred rounded-full shadow-4xl flex items-center justify-center"
          >
            <XIcon className="w-8 h-8 text-white" />
          </button>

          {/* Title */}
          <h2 className="text-primary mb-2 flex gap-4 items-center">
            <span className="text-black font-playwrite">Lịch trống của :</span>
            <div className="text-xl font-bold text-myred">{tutor.name}</div>
          </h2>
          <p className="text-sm text-gray-600 mb-4 ">
            Khoa: {tutor.department}
          </p>

          {/* Slots */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {slots.map((slot, index) => {
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
                    <div className="text-sm text-gray-600 flex gap-4">
                      <span>Còn trống:</span>
                      <div className="text-myred font-bold">
                        {remaining}/{slot.maxSlots}
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
                      Hết chỗ
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
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
