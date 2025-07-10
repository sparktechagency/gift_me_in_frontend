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
  //console.log(subscribers);

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
      title: "Gift Balance",
      dataIndex: "balance",
      key: "balance",
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


      {/* Table Section */}
      <Table dataSource={subscribers} columns={columns} rawKey="_id" />
    </main>
  );
};

export default Page;
