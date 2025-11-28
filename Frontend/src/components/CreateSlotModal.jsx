// src/components/CreateSlotModal.jsx
import React, { useState } from "react";
import { X } from "lucide-react";

export default function CreateSlotModal({ isOpen, onClose, onConfirm }) {
  const [dateTime, setDateTime] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!dateTime) {
      alert("Vui lòng chọn thời gian!");
      return;
    }
    // Chuyển format sang ISO string mà backend cần
    const isoDate = new Date(dateTime).toISOString();
    onConfirm(isoDate);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[400px] relative shadow-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
          <X size={24} />
        </button>
        
        <h2 className="text-xl font-bold mb-4 text-myred">Tạo lịch trống (Tutor)</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Thời gian bắt đầu:</label>
          <input 
            type="datetime-local"
            className="w-full border p-2 rounded focus:outline-myred"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-2 italic">*Một slot kéo dài 2 tiếng</p>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Hủy
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-900">
            Tạo lịch
          </button>
        </div>
      </div>
    </div>
  );
}