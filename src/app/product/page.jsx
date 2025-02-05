"use client";

import React, { useState, useCallback } from "react";
import { Select, Space } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Table from "../../components/Table";
import { productData } from "../../../utils/CustomData";



const TABLE_HEAD = ["Product Name", "Category", "Price", "Status", "Publish Date", "Action"];

const SELECT_OPTIONS = [
  { value: "jack", label: "Jack" },
  { value: "lucy", label: "Lucy" },
  { value: "Yiminghe", label: "Yiminghe" },
];

const Page = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectChange = (value) => console.log(`Selected: ${value}`);

  // Debounced search handler to improve performance
  const handleInputChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  return (
    <main className="p-6 bg-white flex flex-col gap-5 shadow-lg rounded-lg">
      <div className="flex justify-between items-center">
        {/* Filter & Search */}
        <div className="flex items-center gap-3">
          <Space wrap>
            <Select
              defaultValue="Default"
              className="w-[141px] h-[36px] border-red-500"
              onChange={handleSelectChange}
              options={SELECT_OPTIONS}
            />
          </Space>

          {/* Search Input */}
          <div className="relative px-3 py-1.5 border border-gray-200 rounded-lg w-[180px]">
            <input
              type="text"
              className="w-full rounded-md focus:outline-none"
              placeholder="Search"
              aria-label="Search Products"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <button type="button" className="absolute right-4 top-2" aria-label="Search">
              <Image src="/icons/search.png" width={16} height={16} alt="Search Icon" />
            </button>
          </div>
        </div>

        {/* Add Product Button */}
        <button
          onClick={() => router.push("/product/add_product")}
          className="text-white font-medium text-lg bg-[#F82BA9] px-4 py-3 rounded-md"
        >
          + Add Product
        </button>
      </div>

      {/* Product Table */}
      <Table head={TABLE_HEAD} bodyData={productData} />
    </main>
  );
};

export default Page;
