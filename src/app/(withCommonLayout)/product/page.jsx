"use client";

import React, { useState } from "react";
import { Select, Space, Table, Input, Button } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import dayjs from "dayjs";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
} from "../../../redux/apiSlice/productSlice";
import { imageUrl } from "../../../redux/api/baseApi";
import toast from "react-hot-toast";

const { Search } = Input;

const SELECT_OPTIONS = [
  { value: "jack", label: "Jack" },
  { value: "lucy", label: "Lucy" },
  { value: "Yiminghe", label: "Yiminghe" },
];

const Page = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: productData, isLoading } = useGetAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  const products = productData?.data;
  console.log(products);

  // Search filter
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const TABLE_COLUMNS = [
    {
      title: "Serial No",
      dataIndex: "serialNo",
      key: "serialNo",
      align: "center",
      render: (text, record, index) => <p>{index + 1}</p>,
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      render: (text, record) => (
        <span className="flex items-center gap-2">
          <Image
            className="object-cover w-10 h-8 rounded-md"
            src={
              record?.feature?.startsWith("http")
                ? record?.feature
                : `${imageUrl}/${record?.feature}`
            }
            alt=""
            height={40000}
            width={40000}
          />
          <p>{text}</p>
        </span>
      ),
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
        <FaTrash
          className="cursor-pointer text-red-500"
          onClick={() => handleDelete(record._id)}
          size={18}
        />
      ),
    },
  ];

  // Filtered Data
  const filteredData = products?.filter((item) =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      const res = await deleteProduct(id).unwrap();
      if (res?.success) {
        toast.success(res?.message);
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />
    </main>
  );
};

export default Page;
