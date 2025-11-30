import { useState } from "react";
import { TableModal } from "../components/TableModal";
import CalendarModal from "./CalendarModal";
import { ChevronDownIcon } from "lucide-react";

const tutorColumns = [
    { label: "STT", key: "stt", width: "60px" },
    { label: "Họ và tên", key: "name", color: "#9C050C" },
    {
        label: "Khoa",
        key: "department",
        headerRender: () => (
            <div className="flex items-center justify-center gap-1">
                Khoa 
            </div>
        )
    },
    { label: "Số buổi trống", key: "slots" },
];

export default function TutorModal({ isOpen, onClose, tutorData }) {
    const [selectedTutor, setSelectedTutor] = useState(null);

    const handleRowClick = (tutor) => {
        setSelectedTutor(tutor);
    };

    return (
        <>
            <TableModal
                isOpen={isOpen}
                onClose={onClose}
                title="Hãy lựa chọn Tutor/Mentor"
                data={tutorData}
                columns={tutorColumns}
                onRowClick={handleRowClick}
                sidebarContent={
                    <>
                        <img src="/logo.jpg" className="w-[110px] h-[110px] mb-4" />
                        <div className="text-center font-bold text-lg">
                            DANH SÁCH <br /> TUTOR / MENTOR
                        </div>
                    </>
                }
            />

            {selectedTutor && (
                <CalendarModal
                    isOpen={true}
                    onClose={() => setSelectedTutor(null)}
                    tutor={selectedTutor}
                />
            )}
        </>
    );
}

