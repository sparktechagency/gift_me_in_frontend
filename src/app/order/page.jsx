"use client";
import React, { useState } from "react";
import { Select, Space } from "antd";
import Image from "next/image";
import Table from "../../components/Table";
import { OrderData } from "../../../utils/CustomData";





const TableHead = ["#Order No","Date","Customer","Amount","Status","Action"]

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  return (
    <main className="p-6 bg-white flex flex-col gap-5 shadow-lg rounded-lg">
      <div className="flex justify-between items-center">
      <h3 className="text-[#160E4B] font-medium text-[20px] leading-[25px]">
        Order List
        </h3>
        <div className="flex items-center gap-3">
          <Space wrap>
            <Select
              defaultValue="Default"
              style={{ width: "141px", height: "36px", borderColor: "red", color:"#595C5F99" }}
              dropdownStyle={{ borderColor: "red" }}
              onFocus={(e) => (e.target.style.borderColor = "red")}
              onBlur={(e) => (e.target.style.borderColor = "")}
              onChange={handleChange}
              options={[
                { value: "jack", label: "Jack" },
                { value: "lucy", label: "Lucy" },
                { value: "Yiminghe", label: "Yiminghe" },
              ]}
            />
          </Space>

          <div className="relative px-3 py-[6px] border border-gray-200 rounded-lg w-[180px]">
            <input
              type="text"
              className="rounded-md w-full focus:outline-none"
              placeholder="Search"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <button type="button" onClick={handleSearch} className="absolute right-4 top-[10px]">
              <Image src="/icons/search.png" width={16} height={16} alt="Search" />
            </button>
          </div>
        </div>

       
      </div>

        <Table head={TableHead} bodyData={OrderData} />

    </main>
  );
};

export default Page;
