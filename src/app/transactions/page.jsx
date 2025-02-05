"use client";

import React, { useState } from "react";
import { DatePicker } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Table from "../../components/Table";
import { TransectionData } from "../../../utils/CustomData";

const TABLE_HEADINGS = ["Date", "Name", "Subscription Plan", "Billing Cycle", "Amount", "Status"];

const Page = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="p-6 bg-white flex flex-col gap-5 shadow-lg rounded-lg">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h3 className="text-[#160E4B] font-medium text-xl">Transactions</h3>

        
        <DatePicker
          onChange={(date) => setSelectedDate(date)}
          placeholder={
            selectedDate
              ? selectedDate.format("MMMM DD")
              : new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit" })
          }
          suffixIcon={<DownOutlined />}
          picker="month"
          className="h-[48px] w-[180px] border rounded-md px-4"
        />
      </div>

      {/* Transaction Table */}
      <Table head={TABLE_HEADINGS} bodyData={TransectionData} />
    </div>
  );
};

export default Page;
