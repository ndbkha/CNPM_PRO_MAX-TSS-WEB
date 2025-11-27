import React, { useState, useMemo } from "react";
import { XIcon, SearchIcon, ChevronDownIcon } from "lucide-react";
import { TableContainer, TableHeader, TableRow } from "../components/Table";

const columns = [
    { label: "STT", key: "stt", width: "60px" },
    { label: "Họ và tên", key: "name", color: "#9c050c" },
    {
        label: "Khoa",
        key: "department",
        headerRender: () => (
            <div className="flex items-center justify-center gap-1">
                Khoa <ChevronDownIcon className="w-4 h-4" />
            </div>
        ),
        cellRender: (row) => row.department,
    },
    { label: "Số buổi trống", key: "slots" },
];

const TutorModal = ({ isOpen, onClose, tutorData = [] }) => {
    if (!isOpen) return null;
    const [search, setSearch] = useState("");

    const filteredData = useMemo(() => {
        if (!search.trim()) return tutorData;

        const s = search.toLowerCase();
        return tutorData.filter(
            (tutor) =>
                tutor.name.toLowerCase().includes(s) ||
                tutor.department.toLowerCase().includes(s)
        );
    }, [search, tutorData]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative bg-white w-[1000px] max-w-[95%]  rounded-3xl flex overflow-visible shadow-xl">

                {/* LEFT CONTENT */}
                <div className="flex-1 p-6">

                    {/* Header + Search */}
                    <div className="flex items-center justify-between">
                        {/* Title */}
                        <div className="text-center font-playwrite text-black">
                            Hãy lựa chọn Tutor/Mentor
                        </div>

                        {/* Search box */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-white rounded-lg border-2 border-[#dddbdb] h-[45px] w-full px-2">
                                <div className="w-[32px] h-[32px] bg-[#132d65] rounded-[6px] flex items-center justify-center">
                                    <SearchIcon className="w-5 h-5 text-white" />
                                </div>

                                <input
                                    type="text"
                                    placeholder="Tìm kiếm Tutor/Mentor"
                                    className="flex-1 border-0 focus:outline-none text-sm font-medium px-2"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && setSearch(e.target.value)}
                                />

                                <button className="bg-[#132d65] text-white text-xs px-4 h-[32px] rounded-[6px] font-semibold ml-2">
                                    Tìm kiếm
                                </button>
                            </div>
                        </div>
                    </div>

                    <TableContainer>
                        <TableHeader columns={columns} />
                        <tbody>
                            {filteredData.map((tutor, index) => (
                                <TableRow
                                    key={tutor.id}
                                    index={index}
                                    data={tutor}
                                    columns={columns}
                                    renderCell={(column, row, idx) => {
                                        if (column.key === "stt") return idx + 1; // STT = index + 1
                                        return column.cellRender ? column.cellRender(row) : row[column.key];
                                    }}
                                />
                            ))}
                        </tbody>
                    </TableContainer>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="w-[280px] bg-primary flex flex-col items-center justify-center pt-10 pb-6 text-white rounded-r-2xl">
                    <img
                        className="w-[110px] h-[110px] object-contain mb-4"
                        alt="University Logo"
                        src="/logo.jpg"
                    />

                    <div className="font-extrabold text-2xl tracking-wide text-center leading-snug">
                        DANH SÁCH <br /> TUTOR / MENTOR
                    </div>
                </div>

                {/* CLOSE BUTTON */}
                <button
                    onClick={onClose}
                    className="absolute -top-5 -right-5  w-[50px] h-[50px] bg-white rounded-full shadow-xl border border-gray-300 flex items-center justify-center"
                >
                    <XIcon className="w-8 h-8 text-gray-700" />
                </button>
            </div>
        </div>
    );
};

export default TutorModal;
