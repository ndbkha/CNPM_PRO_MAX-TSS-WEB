
// src/components/Functions.jsx
import React from "react";
import CardSection from "./Card/CardSection";
import { href } from "react-router-dom";
import { FileText, Book, CalendarPlus, BarChart2, Headphones, PieChart } from "lucide-react";

const studentCards = [
  { icon: FileText, title: "ĐĂNG KÝ CHƯƠNG TRÌNH", href:"/dang-ky" },
  { icon: Book, title: "TÀI NGUYÊN HỌC TẬP", href:"/tai-nguyen" },
];

const sharedCards = [
  { icon: CalendarPlus, title: "QUẢN LÝ LỊCH HẸN", href:"/lich-hen" },
  { icon: BarChart2, title: "TIẾN ĐỘ HỌC TẬP", href:"/tien-do" },
  { icon: Headphones, title: "BUỔI HỖ TRỢ", href:"/buoi-ho-tro" },
];

const coordinatorCards = [
  { icon: PieChart, title: "BÁO CÁO VÀ THỐNG KÊ", href:"/bao-cao" },
];

const Functions = () => {
  return (
    <main className="flex-1 px-[106px] py-7">
      <div className="font-playwrite text-black text-sm mb-8">Xin chào,</div>

      <CardSection title="SINH VIÊN" cards={studentCards} />
      <CardSection title="DÙNG CHUNG" cards={sharedCards} />
      <CardSection title="ĐIỀU PHỐI VIÊN" cards={coordinatorCards} />
    </main>
  );
};

export default Functions;
