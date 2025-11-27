
import React, { useState } from "react";
import CardSection from "./Card/CardSection";
import { Calendar, PlusSquare } from "lucide-react";

const sharedCards = [
  {
    icon: Calendar,   
    title: "XEM TIẾN ĐỘ",
  },
];

const tutorCards = [
  {
    icon: PlusSquare, 
    title: "TẠO TIẾN ĐỘ",
  },
];

const ProgressFunctions = () => {
    return (
        <main className="flex-1 px-[106px] py-7">
            <div className="flex mb-8 items-center justify-between">
                <div className="font-playwrite font-normal text-black text-sm">
                    Tiến độ học tập
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

export default ProgressFunctions;