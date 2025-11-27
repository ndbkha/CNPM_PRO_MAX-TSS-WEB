// TableHeader.jsx
import React from "react";

export const TableHeader = ({ columns }) => {
    return (
        <thead className="bg-[#132d65] text-white text-sm font-bold sticky top-0">
            <tr>
                {columns.map((col) => (
                    <th
                        key={col.key}
                        className="p-3 border-r border-white/20 text-center"
                        style={{ width: col.width }}
                    >
                        {col.headerRender
                            ? col.headerRender()
                            : col.label}
                    </th>
                ))}
            </tr>
        </thead>
    );
};
export default TableHeader;