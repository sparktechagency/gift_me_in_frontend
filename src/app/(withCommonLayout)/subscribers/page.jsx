"use client";

import React, { useState } from "react";
import { Select } from "antd";
import Image from "next/image";

import { useRouter } from "next/navigation";
import Table from "../../../components/Table";
import { SubscribersData } from "../../../../utils/CustomData";

const TABLE_HEADINGS = [
  "Name",
  "Subscription Plan",
  "Status",
  "Next Billing Date",
  "Action",
];

const Page = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main className="p-6 bg-white flex flex-col gap-5 shadow-lg rounded-lg">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        {/* Filter & Search Section */}
        <div className="flex items-center gap-3">
          {/* Dropdown Filter */}
          <Select
            defaultValue="Default"
            className="w-[141px] h-[36px] border-red-500"
            onChange={(value) => console.log(`Selected: ${value}`)}
            options={[
              { value: "jack", label: "Jack" },
              { value: "lucy", label: "Lucy" },
              { value: "Yiminghe", label: "Yiminghe" },
            ]}
          />

          {/* Search Input */}
          <div className="relative px-3 py-[6px] border border-gray-200 rounded-lg w-[180px]">
            <input
              type="text"
              className="rounded-md w-full focus:outline-none"
              placeholder="Search"
              aria-label="Search Subscribers"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-4 top-[10px]"
              aria-label="Search"
            >
              <Image
                src="/icons/search.png"
                width={16}
                height={16}
                alt="Search Icon"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Table
        head={TABLE_HEADINGS}
        bodyData={SubscribersData}
        routeName="subscription"
      />
    </main>
  );
};

export default Page;
