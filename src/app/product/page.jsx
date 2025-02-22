"use client";

import React, { useState } from "react";
import { Select, Space, Table, Input, Button } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { productData } from "../../../utils/CustomData";
import { useGetAllProductsQuery } from "../../redux/apiSlice/productSlice";
import dayjs from "dayjs";

const { Search } = Input;

const TABLE_COLUMNS = [
  {
    title: "Product Name",
    dataIndex: "productName",
    key: "productName",
    filteredValue: [],
    onFilter: (value, record) =>
      record.productName.toLowerCase().includes(value.toLowerCase()),
  },
  {
    title: "Category",
    dataIndex: ["productCategory", "categoryName"],
    key: "productCategory",
  },
  {
    title: "Regular Price",
    dataIndex: "regularPrice",
    key: "regularPrice",
    align: "center",
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: "Discounted Price",
    dataIndex: "discountedPrice",
    key: "discountedPrice",
    align: "center",
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: "Availability",
    dataIndex: "availability",
    key: "availability",
    render: (availability) => (
      <span
        style={{
          color: availability === "inStock" ? "green" : "red",
        }}
      >
        {availability}
      </span>
    ),
    align: "center",
  },
  {
    title: "Publish Date",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date) => dayjs(date).format("MMM DD, YYYY"),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Button type="link" onClick={() => console.log("View:", record)}>
        View
      </Button>
    ),
  },
];

const SELECT_OPTIONS = [
  { value: "jack", label: "Jack" },
  { value: "lucy", label: "Lucy" },
  { value: "Yiminghe", label: "Yiminghe" },
];

const Page = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: productData, isLoading } = useGetAllProductsQuery();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  const products = productData?.data;
  console.log(products);

  // Search filter
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Filtered Data
  const filteredData = products.filter((item) =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="p-6 bg-white flex flex-col gap-5 shadow-lg rounded-lg">
      <div className="flex justify-between items-center">
        {/* Filter & Search */}
        <div className="flex items-center gap-3">
          <Space wrap>
            <Select
              defaultValue="Default"
              className="w-[141px] h-[36px] border-red-500"
              options={SELECT_OPTIONS}
            />
          </Space>

          {/* Search Input */}
          <Search
            placeholder="Search Products"
            allowClear
            onSearch={handleSearch}
            className="w-[180px]"
          />
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
      <Table
        columns={TABLE_COLUMNS}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </main>
  );
};

export default Page;
