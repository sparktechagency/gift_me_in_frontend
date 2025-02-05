"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import Table from "../../../components/Table";
import { AdminData } from "../../../../utils/CustomData";

const TableHead = ["Name", "Email", "Role", "Created Date", "Action"];

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleSearch = useCallback(() => {
    console.log("Searching for:", searchTerm);
  }, [searchTerm]);

  return (
    <main className="p-6 bg-white flex flex-col gap-5 shadow-lg rounded-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative px-3 py-[6px] border border-gray-200 rounded-lg w-[180px]">
            <input
              type="text"
              className="rounded-md w-full focus:outline-none"
              placeholder="Search"
              value={searchTerm}
              onChange={handleInputChange}
              aria-label="Search admins" 
            />
            <button
              type="button"
              onClick={handleSearch}
              className="absolute right-4 top-[10px]"
              aria-label="Search button" 
            >
              <Image
                src="/icons/search.png"
                width={16}
                height={16}
                alt="Search"
                aria-hidden="true" 
              />
            </button>
          </div>
        </div>

        <button
          className="text-white font-medium text-[20px] bg-[#F82BA9] p-[12px] rounded-[5px] hover:bg-[#E61A8F] transition-colors duration-200" // Add hover effect for better UX
          aria-label="Add Admin" 
        >
          + Add Admin
        </button>
      </div>

      <Table head={TableHead} bodyData={AdminData} routeName="setting" />
    </main>
  );
};

export default Page;