"use client";
import React, { useEffect, useState } from "react";
import { Table, ConfigProvider, Button, Modal, Input, Spin } from "antd";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useGetGiftSentQuery } from "../../../redux/apiSlice/orderSlice";
import { useMarkAsDeliveredMutation } from "../../../redux/apiSlice/productSlice";
import toast from "react-hot-toast";

dayjs.extend(duration);

const Page = () => {
  const [now, setNow] = useState(dayjs());
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [editingGift, setEditingGift] = useState(null);
  const [newGiftInput, setNewGiftInput] = useState("");

  const { data: giftSent, isLoading, refetch } = useGetGiftSentQuery();
  const [markAsDelivered] = useMarkAsDeliveredMutation();

  const handleMarkAsDelivered = async (record) => {
    const data = {
      status: "delivered",
      id: record._id,
    };

    try {
      const res = await markAsDelivered(data).unwrap();
      if (res.success) {
        toast.success(
          record?.overrideName || "Gift marked as delivered successfully"
        );
        refetch();
        setOverrideModalOpen(false);
      }
    } catch (error) {
      console.error("Error marking gift as delivered:", error);
      toast.error(record?.overrideName || "Failed to mark gift as delivered");
    }
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

  const pendingGifts = gifts.filter(
    (gift) => gift.status === "send" || gift.status === "delivered"
  );
  // console.log(pendingGifts);

  const columns = [
    {
      title: "Serial",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (text) => dayjs(text)?.format("MMM DD, YYYY"),
    },
    {
      title: "Customer",
      render: (_, record) => record?.user?.name,
    },
    {
      title: "Email",
      render: (_, record) => record?.user?.email,
    },
    {
      title: "Shipping Address",
      render: (_, record) => record?.event?.address,
    },
    {
      title: "Selected Gift",
      render: (_, record) =>
        record?.product?.map((product) => product.productName).join(", ") ||
        "N/A",
    },

    {
      title: "Time Left",
      dataIndex: "createdAt",
      render: (text) => (
        <span className="">{dayjs(text).format("DD/MM/YYYY")}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <span className="text-[#160E4B] font-medium text-[14px] leading-[17px]">
          {text}
        </span>
      ),
    },
    {
      title: "Mark As Delivered",
      dataIndex: "status",
      render: (_, record) =>
        record.status === "send" ? (
          <Button
            type="primary"
            onClick={() => handleMarkAsDelivered(record)}
            disabled={record.status === "delivered"}
          >
            Mark As Delivered
          </Button>
        ) : (
          <span className="text-[#160E4B] bg-pink-200 px-2 py-1 rounded font-medium text-[14px] leading-[17px]">
            Delivered
          </span>
        ),
    },
  ];

  return (
    <main className="p-6 bg-white flex flex-col gap-5 shadow-lg rounded-lg">
      <h3 className="text-[#160E4B] font-medium text-[20px] leading-[25px]">
        Sent Gifts
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
