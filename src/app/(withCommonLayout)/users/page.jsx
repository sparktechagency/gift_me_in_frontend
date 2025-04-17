"use client";
import { ConfigProvider, Space, Table, Modal, Form, Input } from "antd";
import {
  useAllUsersDataQuery,
  useDeleteUserMutation,
} from "../../../redux/apiSlice/userSlice";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useSignUpMutation } from "../../../redux/apiSlice/authSlice";

const UsersPage = () => {
  const { data: usersData, isLoading, refetch } = useAllUsersDataQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [registerUser] = useSignUpMutation();
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Update filtered data when userDetails changes
  useEffect(() => {
    setFilteredData(usersData?.data || []);
  }, [usersData?.data]);

  if (isLoading) return <p>Loading...</p>;
  const userDetails = usersData?.data;

  const handleSearch = (value) => {
    const searchQuery = value.toLowerCase();
    const filtered = userDetails?.filter((user) => {
      const name = user?.name?.toLowerCase() || "";
      const email = user?.email?.toLowerCase() || "";
      const phone = user?.phone?.toLowerCase() || "";
      return (
        name.includes(searchQuery) ||
        email.includes(searchQuery) ||
        phone.includes(searchQuery)
      );
    });
    setFilteredData(filtered);
    setSearchText(value);
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteUser(id);
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        refetch();
      } else {
        toast.error(res?.data?.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Table columns configuration
  const columns = [
    {
      title: "Serial No.",
      dataIndex: "serialNo",
      key: "serialNo",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={image}
          alt="User"
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },

    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => <p>{phone || "N/A"}</p>,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Space>
          <FaTrash
            onClick={() => handleDelete(record?._id)}
            className="text-red-600 cursor-pointer"
            size={20}
          />
        </Space>
      ),
    },
  ];

  const handleAddUser = async (values) => {
    const data = {
      name: values?.name,
      email: values?.email,
      phone: values?.phone,
      password: values?.password,
      role: "USER",
      status: "active",
    };

    try {
      const res = await registerUser(data).unwrap();
      if (res?.success) {
        toast.success(res?.message);
        form.resetFields();
        setIsModalOpen(false);
        refetch();
      } else {
        toast.error(res?.message);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold mb-4">Users List</h1>
        <Input
          placeholder="Search by name, email, or phone"
          allowClear
          size="large"
          style={{ width: 300 }}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#EC4899] text-white px-4 py-2 rounded-md"
        >
          Add User
        </button>
      </div>

      <ConfigProvider
        theme={{
          components: {
            Table: {
              rowHoverBg: "#f5f5f5",
              headerBg: "#EC4899",
              headerColor: "#ffffff",
            },
          },
        }}
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          key={userDetails?._id}
        />
      </ConfigProvider>

      <Modal
        title="Add New User"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddUser}
          className="mt-4"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input user name!" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[{ required: true, message: "Please input phone number!" }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item className="flex justify-end mb-0">
            <Space>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#EC4899] text-white rounded-md"
              >
                Submit
              </button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersPage;
