import React from "react";
import CardSection from "./Card/CardSection";
import { Download, Bookmark } from "lucide-react";

const studentCards = [
    { icon: Bookmark, title: "LẤY TÀI LIỆU" },
    { icon: Download, title: "TÀI LIỆU ĐÃ LƯU" },
];

const ResourceFunction = () => {
    const userRole = localStorage.getItem("role"); // "student" hoặc "tutor"

    const handleCardClick = () => {
        if (userRole !== "student") {
            alert("Chức năng này chỉ dành cho sinh viên!");
            return;
        }
    };

    return (
        <main className="flex-1 px-[106px] py-7">
            <div className="flex mb-8 items-center justify-between">
                <div className="font-playwrite font-normal text-black text-sm">
                    Tài nguyên của bạn.
                </div>
            </div>

            <CardSection
                title="SINH VIÊN"
                cards={studentCards}
                columns={3}
                onCardClick={handleCardClick}
            />
        </main>
    );
};

export default ResourceFunction;
