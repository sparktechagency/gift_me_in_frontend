"use client";
import { ChevronLeft, ChevronRight, Eye, Pencil } from "lucide-react";
import React, { useState } from "react";

// expected head array [Id, Name, Profile, Action]
// Body Data expected [{}]

const itemsPerPage = 10;

const Table = ({ head, bodyData, routeName }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(bodyData.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const displayedData = bodyData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <table className="min-w-full overflow-hidden">
        <thead className="bg-[#FEEDF7] text-gray-700 uppercase text-sm">
          <tr>
            {head.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-[#160E4B] font-bold text-start"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white">
          {displayedData.map((row, index) => (
            <tr
              key={index}
              className={`hover:bg-gray-50 transition ${
                index % 2 === 0 ? "bg-gray-100" : ""
              }`}
            >
              {Object.entries(row).map(([key, value]) => (
                <td
                  key={key}
                  className={`px-6 py-3 text-start text-[#212529] ${
                    (key === "status" || key === "permission")  && 
                    (value === "Delivered" || value === "In Stock" || value === "Paid" || value === "Active")
                      ? "text-[#28A745]" // Green for Delivered/In Stock
                      : (key === "status"||key=== "permission")
                      ? "text-[#FF0004]" // Red for other statuses
                      : ""
                  } ${key === "OrderNumber" ? "font-bold" : ""}`}
                >
                  {key === "image" ? (
                    <img
                      src={value}
                      alt="Profile"
                      className="w-12 h-12 rounded object-cover"
                    />
                  ) : (
                    value
                  )}
                </td>
              ))}
              {/* Only show the action buttons if "Action" is in the head array */}
              {head.includes("Action") && (
                <td className={`px-6 py-3 text-start`}>
                  <button
                    className={`flex items-center gap-3 transition ${
                      routeName ? "ml-4" : ""
                    }`}
                  >
                    <Eye size={20} />
                    {(routeName === "setting" || routeName === "subscription") ? "" : <Pencil size={18} />}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center gap-2 justify-center mt-4">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0B0027] text-gray-300 hover:text-white hover:bg-pink-500 transition"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={18} />
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition ${
              currentPage === i + 1
                ? "bg-pink-500 text-white"
                : "bg-[#0B0027] text-gray-300"
            }`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0B0027] text-gray-300 hover:text-white hover:bg-pink-500 transition"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </>
  );
};

export default Table;
