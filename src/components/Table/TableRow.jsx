// TableRow.jsx
import React from "react";

export const TableRow = ({ index, data, columns, onClick, renderCell }) => {
    return (
        <tr
            onClick={onClick}
            className={`cursor-pointer ${
                index % 2 === 0 ? "bg-[#efefef]" : "bg-[#e0dddd]"
            } hover:bg-gray-200 transition`}
        >
            {columns.map((col) => (
                <td
                    key={col.key}
                    className="text-center font-bold text-sm p-3 border-r border-white/30"
                    style={{ color: col.color || "#132d65" }}
                >
                    {renderCell
                        ? renderCell(col, data, index)
                        : col.cellRender
                        ? col.cellRender(data)
                        : data[col.key]}
                </td>
            ))}
        </tr>
    );
};

export default TableRow;