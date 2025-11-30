import React, { useState, useMemo } from "react";
import { XIcon, SearchIcon } from "lucide-react";
import { TableContainer, TableHeader, TableRow } from "../Table";

export const TableModal = ({
    isOpen,
    onClose,
    title,
    data,
    columns,
    sidebarContent,
    onRowClick,
    showSearch = true, 
}) => {
    if (!isOpen) return null;

    const [search, setSearch] = useState("");

    // Filter logic
    const filteredData = useMemo(() => {
        if (!search.trim()) return data;

        const s = search.toLowerCase();

        // Tự động filter theo tất cả cột string
        return data.filter((row) =>
            columns.some((col) => {
                const value = row[col.key];
                return (
                    typeof value === "string" &&
                    value.toLowerCase().includes(s)
                );
            })
        );
    }, [search, data, columns]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative bg-white w-[1000px] max-w-[95%] rounded-3xl flex overflow-visible shadow-xl">

                {/* LEFT CONTENT */}
                <div className="flex-1 p-6">

                    {/* Title + Search */}
                    <div className="flex items-center justify-between mb-4">
                        <div className=" text-black font-playwrite">
                            {title}
                        </div>

                        {showSearch && (
                            <div className="flex items-center gap-2">
                                <div className="flex items-center bg-white rounded-lg border-2 border-secondary h-[45px] px-2">
                                    <div className="w-[32px] h-[32px] bg-primary rounded-[6px] flex items-center justify-center">
                                        <SearchIcon className="w-5 h-5 text-white" />
                                    </div>

                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm..."
                                        className="flex-1 border-0 focus:outline-none text-sm font-medium px-2"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <button className="bg-primary text-white text-xs px-4 h-[32px] rounded-[6px] font-semibold ml-2">
                                        Tìm kiếm
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* TABLE */}
                    <TableContainer>
                        <TableHeader columns={columns} />

                        <tbody>
                            {filteredData.map((row, index) => (
                                <TableRow
                                    key={row.id || index}
                                    index={index}
                                    data={row}
                                    columns={columns}
                                    renderCell={(column, row, idx) => {
                                        if (column.key === "stt") return idx + 1;
                                        return column.cellRender
                                            ? column.cellRender(row)
                                            : row[column.key];
                                    }}
                                    onClick={() => onRowClick && onRowClick(row)}
                                />
                            ))}
                        </tbody>
                    </TableContainer>
                </div>

                {/* SIDEBAR RIGHT */}
                <div className="w-[260px] bg-primary text-white flex flex-col items-center justify-center p-6 rounded-r-2xl">
                    {sidebarContent}
                </div>

                {/* CLOSE BUTTON */}
                <button
                    onClick={onClose}
                    className="absolute -top-5 -right-5 w-[50px] h-[50px] bg-white rounded-full shadow-xl border border-gray-300 flex items-center justify-center"
                >
                    <XIcon className="w-8 h-8 text-gray-700" />
                </button>

            </div>
        </div>
    );
};

export default TableModal;
