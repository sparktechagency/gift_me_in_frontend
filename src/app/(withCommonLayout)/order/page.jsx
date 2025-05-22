"use client";
import React, { useState } from "react";
import { ConfigProvider, Select, Space, Table } from "antd";
import Image from "next/image";

import { OrderData } from "../../../../utils/CustomData";

import dayjs from "dayjs";
import { useGetAllOrdersQuery } from "../../../redux/apiSlice/orderSlice";

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: orders, error, isLoading } = useGetAllOrdersQuery();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  const orderData = orders?.data;
  //console.log(orderData);

  const handleChange = (value) => {
    //console.log(`selected ${value}`);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    //console.log("Searching for:", searchTerm);
  };

  const columns = [
    {
      title: "Serial No",
      dataIndex: "serialNo",
      key: "serialNo",
      render: (text, record, index) => <p>{index + 1}</p>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <p>{dayjs(text).format("MMM DD, YYYY")}</p>,
    },
    {
      title: "Customer",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "userEmail",
      key: "userEmail",
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
      render: (_, record) => (
        <span>
          {record?.products?.map((product) => product.name).join(", ")}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (text) => <p>${text}</p>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    // {
    //   title: "Action",
    //   key: "action",
    // },
  ];

  return (
    <main className="p-6 bg-white flex flex-col gap-5 shadow-lg rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-[#160E4B] font-medium text-[20px] leading-[25px]">
          Order List
        </h3>
        <div className="flex items-center gap-3">
          <div className="relative px-3 py-[6px] border border-gray-200 rounded-lg w-[180px]">
            <input
              type="text"
              className="rounded-md w-full focus:outline-none"
              placeholder="Search"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <button
              type="button"
              onClick={handleSearch}
              className="absolute right-4 top-[10px]"
            >
              <Image
                src="/icons/search.png"
                width={16}
                height={16}
                alt="Search"
              />
            </button>
          </div>
        </div>
      </div>

      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#feedf7",
            },
          },
        }}
      >
        <Table dataSource={orderData} columns={columns} />
      </ConfigProvider>
    </main>
  );
};

export default Page;
