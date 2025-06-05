"use client";
import React, { useEffect, useState } from "react";
import { Table, ConfigProvider, Button, Modal, Input, Spin } from "antd";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useGetGiftSentQuery } from "../../../redux/apiSlice/orderSlice";
import { Key } from "lucide-react";

dayjs.extend(duration);

const Page = () => {
  const [now, setNow] = useState(dayjs());
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [editingGift, setEditingGift] = useState(null);
  const [newGiftInput, setNewGiftInput] = useState("");

  const { data: giftSent, isLoading } = useGetGiftSentQuery();

  // Live timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Utility to calculate time left
  const getTimeLeft = (createdAt) => {
    const createdTime = dayjs(createdAt);
    const expiration = createdTime.add(48, "hour");
    const timeLeft = expiration.diff(now, "second");

    if (timeLeft <= 0) return "Expired";

    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Override modal trigger
  const handleOverride = (record) => {
    setEditingGift(record);
    setNewGiftInput(record.overrideName || record.product.productName);
    setOverrideModalOpen(true);
  };

  // Override handler (temporary, local override)
  const handleSaveOverride = () => {
    if (editingGift) {
      editingGift.overrideName = newGiftInput; // Just temporary, not persisted
    }
    setEditingGift(null);
    setOverrideModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin />
      </div>
    );
  }

  const gifts = giftSent?.data || [];

  const pendingGifts = gifts.filter((gift) => gift.status === "pending");

  const columns = [
    {
      title: "Serial",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text) => dayjs(text)?.format("MMM DD, YYYY"),
    },
    {
      title: "Event Date",
      dataIndex: ["event", "eventDate"],
      render: (text) => dayjs(text)?.format("MMM DD, YYYY"),
    },
    {
      title: "Customer",
      dataIndex: ["event", "RecipientName"],
      Key: "event",
    },
    {
      title: "Email",
      render: (_, record) => record?.user?.email,
    },
    {
      title: "Selected Gift",
      render: (_, record) =>
        record?.overrideName || record?.product?.productName,
    },
    {
      title: "Estimated Amount",
      render: (_, record) => `$${record?.product?.discountedPrice}`,
    },
    {
      title: "Time Left",
      dataIndex: "updatedAt",
      render: (text) => (
        <span className="text-red-500">{getTimeLeft(text)}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <span
          className={`${
            text === "pending"
              ? "text-yellow-500"
              : text === "overridden"
              ? "text-blue-500"
              : "text-green-600"
          } font-medium`}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button type="link" onClick={() => handleOverride(record)}>
          Override
        </Button>
      ),
    },
  ];

  return (
    <main className="p-6 bg-white flex flex-col gap-5 shadow-lg rounded-lg">
      <h3 className="text-[#160E4B] font-medium text-[20px] leading-[25px]">
        Gifts (Pending Approval)
      </h3>

      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#feedf7",
            },
          },
        }}
      >
        <Table columns={columns} dataSource={pendingGifts} rowKey="_id" />
      </ConfigProvider>

      <Modal
        title="Override Gift Selection"
        open={overrideModalOpen}
        onCancel={() => setOverrideModalOpen(false)}
        onOk={handleSaveOverride}
        okText="Save"
      >
        <label className="block mb-2">Enter new gift name:</label>
        <Input
          value={newGiftInput}
          onChange={(e) => setNewGiftInput(e.target.value)}
        />
      </Modal>
    </main>
  );
};

export default Page;
