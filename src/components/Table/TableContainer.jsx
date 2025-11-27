// components/Table/TableContainer.jsx
import React from "react";

const TableContainer = ({ children }) => {
  return (
    <div
      className="mt-5 overflow-auto rounded-xl border border-[#dddddd] h-[500px]"
    >
      <table className="w-full border-collapse">
        {children}
      </table>
    </div>
  );
};

export default TableContainer;
