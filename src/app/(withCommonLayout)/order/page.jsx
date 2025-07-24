"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  ConfigProvider,
  Button,
  Modal,
  Input,
  Spin,
  Tag,
  Space,
  Select,
  message,
} from "antd";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {
  useGetAllProductsByCategoryQuery,
  useGetGiftSentQuery,
  useOverrideGiftMutation,
} from "../../../redux/apiSlice/orderSlice";
import { CloseOutlined } from "@ant-design/icons";
import {
  useGetAllProductsQuery,
  useMarkAsDeliveredMutation,
} from "../../../redux/apiSlice/productSlice";
import toast from "react-hot-toast";

dayjs.extend(duration);

const Page = () => {
  const [now, setNow] = useState(dayjs());
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [editingGift, setEditingGift] = useState(null);
  const [newGiftInput, setNewGiftInput] = useState("");
  const [currentGifts, setCurrentGifts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  console.log(categoryProducts);

  const { data: giftSent, isLoading, refetch } = useGetGiftSentQuery();
  const [overrideGift, { isLoading: isOverriding }] = useOverrideGiftMutation();
  const [markAsSend] = useMarkAsDeliveredMutation();

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const handleOverride = async (record) => {
    setEditingGift(record);
    setSelectedCategory(record?.event?.category || "");

    // Initialize current gifts with existing product IDs
    const initialGifts = record.product?.map((p) => p._id) || [];
    setCurrentGifts(initialGifts);
    setOverrideModalOpen(true);
  };

  const { data: productsData, isLoading: isProductsLoading } =
    useGetAllProductsQuery();

  useEffect(() => {
    if (productsData?.data) {
      setCategoryProducts(productsData.data);
    }
  }, [productsData]);

  const handleAddCustomGift = () => {
    if (newGiftInput.trim()) {
      // For custom gifts, we'll need to handle this differently since they won't have IDs
      // This assumes your API can handle string product names in the array
      setCurrentGifts([...currentGifts, newGiftInput.trim()]);
      setNewGiftInput("");
    }
  };

  const handleMarkAsSend = async (record) => {
    const data = {
      status: "send",
      id: record._id,
    };

    try {
      const res = await markAsSend(data).unwrap();
      if (res.success) {
        toast.success(
          record?.overrideName || "Gift marked as send successfully"
        );
        refetch();
        setOverrideModalOpen(false);
      }
    } catch (error) {
      console.error("Error marking gift as send:", error);
      toast.error(record?.overrideName || "Failed to mark gift as send");
    }
  };

  const handleSelectGift = (value, option) => {
    // option contains the full product object including _id
    if (value && !currentGifts.includes(option.product._id)) {
      setCurrentGifts([...currentGifts, option.product._id]);
    }
  };

  const handleRemoveGift = (giftToRemove) => {
    setCurrentGifts(
      currentGifts.filter(
        (gift, index) => gift !== giftToRemove
        // Or if you need to handle duplicates differently:
        // (gift, index) => index !== currentGifts.indexOf(giftToRemove)
      )
    );
  };

  const handleSaveOverride = async () => {
    if (!editingGift) return;

    try {
      const response = await overrideGift({
        id: editingGift._id,
        data: {
          product: currentGifts.filter(
            (gift) => typeof gift === "string" && gift.length === 24
          ), // Only include valid MongoDB IDs
        },
      }).unwrap();

      if (response.success) {
        message.success("Gift override successful");
        refetch();
        setOverrideModalOpen(false);
      }
    } catch (err) {
      message.error(err.data?.message || "Failed to override gift");
    }
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

  // Create options for the Select component with both label and value
  const productOptions =
    categoryProducts?.map((product) => ({
      value: product.productName,
      label: product.productName,
      product: product, // Include the full product object
    })) || [];

  // Helper function to get product name by ID
  const getProductNameById = (id) => {
    const product = categoryProducts.find((p) => p._id === id);
    return product?.productName || id; // Fallback to ID if product not found
  };

  const columns = [
    {
      title: "Serial",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Event Date",
      dataIndex: ["event", "eventDate"],
      render: (text) => dayjs(text)?.format("MMM DD, YYYY"),
    },
    {
      title: "Customer",
      dataIndex: ["event", "RecipientName"],
    },
    {
      title: "Email",
      render: (_, record) => record?.user?.email || "N/A",
    },
    {
      title: "Contact",
      render: (_, record) => record?.event?.phone || "N/A",
    },
    {
      title: "Address",
      render: (_, record) => record?.event?.address,
    },
    {
      title: "Selected Gift",
      render: (_, record) =>
        record?.overrideName ||
        record?.product?.map((product) => product.productName).join(", "),
    },
    {
      title: "Time Left",
      dataIndex: "updatedAt",
      render: (text) => (
        <span className="text-red-500">{getTimeLeft(text)}</span>
      ),
    },
    {
      title: "Selected Gift Price",
      dataIndex: "selectedGiftPrice",
      render: (text) => <span className="text-red-500">{text || "0"}</span>,
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
    {
      title: "Mark As Send",
      dataIndex: "status",
      render: (_, record) =>
        record.status === "pending" ? (
          <Button
            type="primary"
            onClick={() => handleMarkAsSend(record)}
            disabled={record.status === "send"}
          >
            Mark As Send
          </Button>
        ) : (
          <span className="text-[#160E4B] font-medium text-[14px] leading-[17px]">
            Send
          </span>
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
        confirmLoading={isOverriding}
        width={600}
      >
        <div className="mb-4">
          <label className="block mb-2 font-medium">Category:</label>
          <p className="mb-4">{selectedCategory}</p>

          <label className="block mb-2 font-medium">Available Products:</label>
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Select a product"
            optionFilterProp="children"
            onChange={handleSelectGift}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={productOptions}
            loading={isProductsLoading}
            className="mb-4"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Current Gifts:</label>
          {currentGifts.length > 0 ? (
            <Space size={[8, 8]} wrap>
              {currentGifts.map((giftId) => (
                <Tag
                  key={giftId}
                  closable
                  onClose={() => handleRemoveGift(giftId)}
                  closeIcon={<CloseOutlined />}
                  className="text-sm py-1 px-2"
                >
                  {getProductNameById(giftId)}
                </Tag>
              ))}
            </Space>
          ) : (
            <p className="text-gray-500">No gifts selected</p>
          )}
        </div>

        <p className="text-gray-500 text-sm">
          Select products from the dropdown to override. Custom gifts are for
          display only.
        </p>
      </Modal>
    </main>
  );
};

export default Page;
