"use client";

import {
  Spin,
  Table,
  Tag,
  Avatar,
  Button,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import {
  useGetSubscribersQuery,
  useUpdateBudgetMutation,
} from "../../../redux/apiSlice/packageSlice";
import { useState } from "react";
import { EditOutlined } from "@ant-design/icons";

const page = () => {
  const { data: subscribers, isLoading } = useGetSubscribersQuery();
  const [updateBudget, { isLoading: isUpdating }] = useUpdateBudgetMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [form] = Form.useForm();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin />
      </div>
    );
  }

  const subscriberData = subscribers?.data;
  console.log(subscriberData);

  const showModal = (record) => {
    setSelectedSubscriber(record);
    form.setFieldsValue({
      amountPaid: record.amountPaid,
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedSubscriber(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      const response = await updateBudget({
        id: selectedSubscriber?.user?._id,
        data: { amountPaid: parseFloat(values.amountPaid) },
      }).unwrap();

      if (response.success) {
        message.success("Budget updated successfully");
        setIsModalOpen(false);
        form.resetFields();
      } else {
        message.error(response.message || "Failed to update budget");
      }
    } catch (error) {
      message.error("An error occurred while updating the budget");
      console.error(error);
    }
  };

  // Define columns for the table
  const columns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (user) => (
        <div className="flex items-center gap-2">
          <Avatar src={user.image} alt={user.name}>
            {user.name.charAt(0)}
          </Avatar>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-gray-500 text-sm">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Package",
      dataIndex: "package",
      key: "package",
      render: (pkg) => (
        <div>
          <div className="font-medium">{pkg.name}</div>
          <div className="text-gray-500 text-sm">Duration: {pkg.duration}</div>
        </div>
      ),
    },
    {
      title: "Balance Budget",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (amount) => `$${amount}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Payment Type",
      dataIndex: "paymentType",
      key: "paymentType",
      render: (type) => type.charAt(0).toUpperCase() + type.slice(1),
    },
    {
      title: "Period",
      key: "period",
      render: (_, record) => (
        <div>
          <div>
            Start: {new Date(record.currentPeriodStart).toLocaleDateString()}
          </div>
          <div>
            End: {new Date(record.currentPeriodEnd).toLocaleDateString()}
          </div>
        </div>
      ),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => showModal(record)}
          className="bg-[#F82BA9] hover:bg-[#E61A8F]"
        >
          Edit Budget
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Subscribers Data</h1>

      <div className="bg-white rounded-lg shadow-md p-4">
        <Table
          columns={columns}
          dataSource={subscriberData}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          scroll={{ x: "max-content" }}
          bordered
        />
      </div>

      <Modal
        title="Edit Budget"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="amountPaid"
            label="Budget Balance"
            rules={[
              { required: true, message: "Please enter the amount" },
              {
                pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
                message: "Please enter a valid amount (up to 2 decimal places)",
              },
            ]}
          >
            <Input
              prefix="$"
              placeholder="Enter amount"
              type="number"
              step="0.01"
              min="0"
            />
          </Form.Item>
          <Form.Item className="mb-0 flex justify-end">
            <Button onClick={handleCancel} className="mr-2">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isUpdating}
              className="bg-[#F82BA9] hover:bg-[#E61A8F]"
            >
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default page;
