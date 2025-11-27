import React from "react";

const studentCards = [
    {
        icon: "https://c.animaapp.com/mig5whntbIbmXx/img/signing-a-document.png",
        title: "ĐĂNG KÝ CHƯƠNG TRÌNH",
    },
    {
        icon: "https://c.animaapp.com/mig5whntbIbmXx/img/books.png",
        title: "TÀI NGUYÊN HỌC TẬP",
    },
];

const sharedCards = [
    {
        icon: "https://c.animaapp.com/mig5whntbIbmXx/img/calendar-plus.png",
        title: "QUẢN LÝ LỊCH",
    },
    {
        icon: "https://c.animaapp.com/mig5whntbIbmXx/img/total-sales.png",
        title: "TIẾN ĐỘ HỌC TẬP",
    },
    {
        icon: "https://c.animaapp.com/mig5whntbIbmXx/img/online-support.png",
        title: "BUỔI HỖ TRỢ",
    },
];

const coordinatorCards = [
    {
        icon: "https://c.animaapp.com/mig5whntbIbmXx/img/analytics.png",
        title: "BÁO CÁO VÀ THỐNG KÊ",
    },
];

const Functions = () => {
    return (
        <>
            <main className="flex-1 px-[106px] py-7">
                <div className="flex">
                    <div className="font-playwrite font-normal text-black text-sm text-left tracking-[0] leading-[normal] mb-8">
                        Xin chào,
                    </div>
                </div>

                <section className="mb-[31px]">
                    <h2 className=" font-extrabold text-black text-xl tracking-[0] leading-[normal] mb-6">
                        SINH VIÊN
                    </h2>
                    <div className="grid grid-cols-2 gap-[36px]">
                        {studentCards.map((card, index) => (
                            <button
                                key={index}
                                className="flex overflow-hidden rounded-[10px] border-0 shadow-none h-[150px] hover:opacity-75"
                            >
                                <div className="flex p-0 w-full">
                                    <div className="w-[141px] bg-white rounded-[10px_0px_0px_10px] border-[3px] border-solid border-primary flex items-center justify-center">
                                        <img
                                            className="w-[90px] h-[90px]"
                                            alt={card.title}
                                            src={card.icon}
                                        />
                                    </div>
                                    <div className="flex-1 bg-primary flex items-center justify-center rounded-[0px_10px_10px_0px]">
                                        <h3 className="font-extrabold text-white text-[26px] text-center tracking-[0] leading-[normal] px-4">
                                            {card.title}
                                        </h3>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="mb-[31px]">
                    <h2 className="font-extrabold text-black text-xl tracking-[0] leading-[normal] mb-6">
                        DÙNG CHUNG
                    </h2>
                    <div className="grid grid-cols-2 gap-x-[36px] gap-y-[31px]">
                        {sharedCards.map((card, index) => (
                            <div
                                key={index}
                                className="flex overflow-hidden rounded-[10px] border-0 shadow-none h-[150px]"
                            >
                                <div className="flex p-0 w-full">
                                    <div className="w-[141px] bg-white rounded-[10px_0px_0px_10px] border-[3px] border-solid border-primary flex items-center justify-center">
                                        <img
                                            className="w-[90px] h-[90px]"
                                            alt={card.title}
                                            src={card.icon}
                                        />
                                    </div>
                                    <div className="flex-1 bg-primary flex items-center justify-center rounded-[0px_10px_10px_0px]">
                                        <h3 className="font-extrabold text-white text-[26px] text-center tracking-[0] leading-[normal] px-4">
                                            {card.title}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-[31px]">
                    <h2 className="font-extrabold text-black text-xl tracking-[0] leading-[normal] mb-6">
                        ĐIỀU PHỐI VIÊN
                    </h2>
                    <div className="grid grid-cols-2 gap-[36px]">
                        {coordinatorCards.map((card, index) => (
                            <div
                                key={index}
                                className="flex overflow-hidden rounded-[10px] border-0 shadow-none h-[150px]"
                            >
                                <div className="flex p-0 w-full">
                                    <div className="w-[141px] bg-white rounded-[10px_0px_0px_10px] border-[3px] border-solid border-primary flex items-center justify-center">
                                        <img
                                            className="w-[90px] h-[90px]"
                                            alt={card.title}
                                            src={card.icon}
                                        />
                                    </div>
                                    <div className="flex-1 bg-primary flex items-center justify-center rounded-[0px_10px_10px_0px]">
                                        <h3 className="font-extrabold text-white text-[26px] text-center tracking-[0] leading-[normal] px-4">
                                            {card.title}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
}
export default Functions;