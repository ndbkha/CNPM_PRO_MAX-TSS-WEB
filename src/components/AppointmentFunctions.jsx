
import React, { useState } from "react";
import CardSection from "./Card/CardSection";
import { CheckSquare, Eye, MessageSquare } from "lucide-react";


const studentCards = [
    {
        icon: CheckSquare,
        title: "ĐÁNH GIÁ BUỔI HỖ TRỢ",
    },
    {
        icon: Eye,
        title: "XEM PHẢN HỒI",
    },
];

const tutorCards = [
    {
        icon: MessageSquare,
        title: "PHẢN HỒI ĐÁNH GIÁ",
    },
];


const AppointmentFunctions = () => {
    const userRole = localStorage.getItem("role"); // "student" hoặc "tutor"


    const handleStudentCardClick = () => {
        if (userRole !== "student") {
            alert("Chức năng này chỉ dành cho sinh viên!");
            return;
        }
    };
    const handleTutorCardClick = () => {
        if (userRole !== "tutor") {
            alert("Chức năng này chỉ dành cho tutor/mentor!");
            return;
        }
    };
    return (
        <main className="flex-1 px-[106px] py-7">
            <div className="flex mb-8 items-center justify-between">
                <div className="font-playwrite font-normal text-black text-sm">
                    Buổi hỗ trợ của bạn.
                </div>
            </div>

            <CardSection
                title="SINH VIÊN"
                cards={studentCards}
                columns={3}
                onCardClick={handleStudentCardClick}
            />
            <CardSection
                title="TUTOR/MENTOR"
                cards={tutorCards}
                columns={3}
                onCardClick={handleTutorCardClick}

            />
        </main>
    );
};

export default AppointmentFunctions;