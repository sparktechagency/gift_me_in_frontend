"use client";

import React, { useState } from "react";
import {
  Select,
  Space,
  Table,
  Input,
  Button,
  Modal,
  Upload,
  message,
} from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { InboxOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
  useUploadExcelProductMutation,
} from "../../../redux/apiSlice/productSlice";
import { imageUrl } from "../../../redux/api/baseApi";
import toast from "react-hot-toast";

const { Search } = Input;
const { Dragger } = Upload;

const SELECT_OPTIONS = [
  { value: "jack", label: "Jack" },
  { value: "lucy", label: "Lucy" },
  { value: "Yiminghe", label: "Yiminghe" },
];

const Page = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);

  const { data: productData, isLoading } = useGetAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [uploadCSV] = useUploadExcelProductMutation();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  const products = productData?.data;

  // Upload props for CSV
  const uploadProps = {
    name: "file",
    multiple: false,
    accept: ".csv",
    fileList,
    beforeUpload: (file) => {
      const isCsv = file.type === "text/csv" || file.name.endsWith(".csv");
      if (!isCsv) {
        message.error("You can only upload CSV files!");
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);
      return false;
    },
    onRemove: () => {
      setFileList([]);
    },
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.error("Please select a CSV file first!");
      return;
    }

    const formData = new FormData();
    formData.append("csv", fileList[0]);

    try {
      const res = await uploadCSV(formData).unwrap();
      if (res?.success) {
        toast.success(res?.message || "CSV file uploaded successfully");
        setIsModalOpen(false);
        setFileList([]);
      } else {
        toast.error(res?.message || "Failed to upload file");
      }
    } catch (error) {
      toast.error("Failed to upload file");
    }
  };

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
      dataIndex: "category",
      key: "category",
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
      //console.log(error);
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-white flex items-center gap-2 font-medium text-lg bg-[#F82BA9] px-4 py-3 rounded-md"
          >
            <FiUpload />
            Upload Excel
          </button>
          <button
            onClick={() => router.push("/product/add_product")}
            className="text-white font-medium text-lg bg-[#F82BA9] px-4 py-3 rounded-md"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Product Table */}
      <Table
        columns={TABLE_COLUMNS}
        dataSource={filteredData}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />

      {/* CSV Upload Modal */}
      <Modal
        title="Upload CSV File"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setFileList([]);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsModalOpen(false);
              setFileList([]);
            }}
          >
            Cancel
          </Button>,
          <Button
            key="upload"
            type="primary"
            onClick={handleUpload}
            className="bg-[#F82BA9]"
            disabled={fileList.length === 0}
          >
            Upload
          </Button>,
        ]}
      >
        <div className="py-4">
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag CSV file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for single CSV file upload only. Please ensure your CSV
              file follows the required format.
            </p>
          </Dragger>
        </div>
      </Modal>
    </main>
  );
};

export default Page;
