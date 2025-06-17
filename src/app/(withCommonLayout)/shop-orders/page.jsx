"use client";

import { useGetAllOrdersQuery } from "../../../redux/apiSlice/orderSlice";
import { Table, Tag, Typography } from "antd";

const { Text } = Typography;

const OrdersPage = () => {
  const { data: ordersData, isLoading } = useGetAllOrdersQuery(undefined);
  const orders = ordersData?.data || [];

  // Main table columns
  const columns = [
    {
      title: "Serial Number",
      dataIndex: "serialNumber",
      key: "serialNumber",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Customer Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "userEmail",
      key: "userEmail",
    },
    {
      title: "Amount Paid",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (amount) => <Text strong>${amount}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "completed" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Location",
      key: "location",
      render: (_, record) =>
        `${record.streetAddress}, ${record.city}, ${record.country}, ${record.postCode}`,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  // Sub-table for products
  const productColumns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price per Unit",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}`,
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) => `$${record.price * record.quantity}`,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 className="text-2xl font-semibold mb-10">All Shop Orders</h1>
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={orders}
        loading={isLoading}
        bordered
        pagination={{ pageSize: 5 }}
        expandable={{
          expandedRowRender: (record) => (
            <div style={{ marginLeft: 24 }}>
              <h4>Products in this order</h4>
              <Table
                columns={productColumns}
                dataSource={record.products}
                rowKey="_id"
                pagination={false}
                size="small"
                bordered
              />
              <p style={{ marginTop: 12 }}>
                <strong>Order Message:</strong> {record.orderMessage || "—"}
              </p>
            </div>
          ),
        }}
      />
    </div>
  );
};

export default OrdersPage;
