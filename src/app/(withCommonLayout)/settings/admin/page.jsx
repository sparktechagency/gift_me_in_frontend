"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import {
  useCreateAdminMutation,
  useDeleteAdminMutation,
  useGetAllAdminQuery,
} from "../../../../redux/apiSlice/authSlice";
import { Table, Modal, Form, Input, Button, message } from "antd";
import dayjs from "dayjs";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { data: adminData, isLoading, refetch } = useGetAllAdminQuery();
  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [deleteAdmin] = useDeleteAdminMutation();
  const admins = adminData?.data;

  const handleInputChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleSearch = useCallback(() => {
    //console.log("Searching for:", searchTerm);
  }, [searchTerm]);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const handleAddAdmin = async (values) => {
    //console.log(values);

    const data = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      password: values.password,
      role: "ADMIN",
    };

    try {
      await createAdmin(data).unwrap();
      toast.success("Admin added successfully");
      form.resetFields();
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add admin");
    }
  };

  const handleDeleteAdmin = async (id) => {
    const confirmModal = Modal.confirm({
      title: "Do you want to delete this admin?",
      content: "This action is irreversible",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteAdmin(id).unwrap();
          toast.success("Admin deleted successfully");
          refetch();
        } catch (error) {
          toast.error(error?.data?.message || "Failed to delete admin");
        }
      },
    });
  };

  const columns = [
    {
      title: "Serial",
      dataIndex: "serial",
      key: "serial",
      render: (text, record, index) => index + 1,
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("YYYY-MM-DD"),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <div className="flex gap-2">
          <FaTrash
            onClick={() => handleDeleteAdmin(record?._id)}
            size={20}
            className="text-red-500 cursor-pointer"
          />
        </div>
      ),
    },
  ];

  return (
    <main className="p-6 bg-white flex flex-col gap-5 shadow-lg rounded-lg">
      <div className="flex justify-between items-center">
        <div className="relative px-3 py-[6px] border border-gray-200 rounded-lg w-[180px]">
          <input
            type="text"
            className="rounded-md w-full focus:outline-none"
            placeholder="Search"
            value={searchTerm}
            onChange={handleInputChange}
            aria-label="Search admins"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="absolute right-4 top-[10px]"
            aria-label="Search button"
          >
            <Image
              src="/icons/search.png"
              width={16}
              height={16}
              alt="Search"
              aria-hidden="true"
            />
          </button>
        </div>

        <button
          onClick={showModal}
          className="text-white font-medium text-[20px] bg-[#F82BA9] p-[12px] rounded-[5px] hover:bg-[#E61A8F] transition-colors duration-200"
          aria-label="Add Admin"
        >
          + Add Admin
        </button>
      </div>

      <Table dataSource={admins} columns={columns} loading={isLoading} />

      <Modal
        title="Add Admin"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddAdmin}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input placeholder="Enter email" type="email" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              className="w-full bg-[#F82BA9] hover:bg-[#E61A8F]"
              loading={isCreating}
            >
              Add Admin
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
};

export default Page;
