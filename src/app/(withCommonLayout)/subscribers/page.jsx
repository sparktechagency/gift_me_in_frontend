"use client";

import React, { useState } from "react";
import { Select, Table, Tooltip } from "antd";
import Image from "next/image";

import { useRouter } from "next/navigation";

import { useGetAllSubscribersQuery } from "../../../redux/apiSlice/eventSlice";
import dayjs from "dayjs";

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

  const { data: subscribersData, isLoading } = useGetAllSubscribersQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const subscribers = subscribersData?.data;
  console.log(subscribers);

  const columns = [
    {
      title: "Serial",
      dataIndex: "serialNo",
      key: "serialNo",
      render: (text, record, index) => <p>{index + 1}</p>,
    },
    {
      title: "SubscriberName",
      dataIndex: ["user", "name"],
      key: "user",
    },
    {
      title: "Subscription Plan",
      dataIndex: ["package", "category"],
      key: "package",
    },
    {
      title: "Duration",
      dataIndex: ["package", "duration"],
      key: "duration",
    },
    {
      title: "Amount Paid",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (text) => <p>${text}</p>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <p
          className={`${text === "active" ? "text-green-500" : "text-red-500"}`}
        >
          {text}
        </p>
      ),
    },
    {
      title: "Next Billing Date",
      dataIndex: ["package", "currentPeriodEnd"],
      key: "currentPeriodEnd",
      render: (text) => <p>{dayjs(text).format("MMM DD, YYYY")}</p>,
    },
    {
      title: "Subscription Id",
      dataIndex: "subscriptionId",
      key: "subscriptionId",
      render: (text) => (
        <Tooltip title={text} placement="top" arrow>
          {text?.slice(0, 8)}...
        </Tooltip>
      ),
    },
    {
      title: "Transaction Id",
      dataIndex: "trxId",
      key: "trxId",
      render: (text) => (
        <Tooltip title={text} placement="top" arrow>
          {text?.slice(0, 8)}...
        </Tooltip>
      ),
    },
  ];

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
      <Table dataSource={subscribers} columns={columns} rawKey="_id" />
    </main>
  );
};

export default Page;
