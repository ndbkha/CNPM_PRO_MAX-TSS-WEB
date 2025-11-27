// ConfirmModal.js
import React from "react";
import { XIcon } from "lucide-react";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-[400px] rounded-2xl shadow-lg p-6 relative">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute -top-5 -right-5 w-[40px] h-[40px] bg-gray-800 rounded-full flex items-center justify-center"
        >
          <XIcon className="w-5 h-5 text-white" />
        </button>

        <h2 className="text-center font-bold text-lg mb-6 text-primary">
          {title || "Xác nhận đăng ký chương trình"}
        </h2>

        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-10 py-2 bg-primary text-white rounded-lg font-semibold"
          >
            Xác nhận
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded-lg font-semibold"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
