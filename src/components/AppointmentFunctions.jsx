// src/components/Register.jsx
import React, { useState } from "react";
import CardSection from "./Card/CardSection";

import { Calendar, Trash2, Edit, PlusSquare } from "lucide-react";

const sharedCards = [
  {
    icon: Calendar,
    title: "LỊCH CỦA TÔI",
  },
  {
    icon: Trash2,
    title: "HỦY LỊCH",
  },
  {
    icon: Edit,
    title: "THAY ĐỔI LỊCH",
  },
];

const tutorCards = [
  {
    icon: PlusSquare,
    title: "TẠO LỊCH TRỐNG",
  },
];


const AppointmentFunctions = () => {
    return (
        <main className="flex-1 px-[106px] py-7">
            <div className="flex mb-8 items-center justify-between">
                <div className="font-playwrite font-normal text-black text-sm">
                    Lịch của bạn.
                </div>
            </div>

            <CardSection
                title="DÙNG CHUNG"
                cards={sharedCards}
                columns={3}
            />
            <CardSection
                title="TUTOR/MENTOR"
                cards={tutorCards}
                columns={3}
            />
        </main>
    );
};

export default AppointmentFunctions;