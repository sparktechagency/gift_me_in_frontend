"use client";

import {
  Card,
  Spin,
  Tag,
  Button,
  Modal,
  Form,
  InputNumber,
  Input,
  Select,
  Switch,
  Space,
} from "antd";
import {
  useAddPackageMutation,
  useAllPackagesQuery,
  useEditPackageMutation,
} from "../../../redux/apiSlice/packageSlice";
import { CheckCircleOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import toast from "react-hot-toast";

const PackagePage = () => {
  const { data: packages, isLoading } = useAllPackagesQuery();
  const [addPackage] = useAddPackageMutation();
  const [editPackage, { isLoading: isEditLoading }] = useEditPackageMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [form] = Form.useForm();
  const { TextArea } = Input;

  if (isLoading) {
    return (
      <Spin
        size="large"
        className="flex justify-center items-center h-screen"
      />
    );
  }

  const allPackages = packages?.data;

  const handleEdit = (pkg) => {
    setSelectedPackage(pkg);
    form.setFieldsValue({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      duration: pkg.duration,
      paymentType: pkg.paymentType,
      category: pkg.category,
      features: pkg.features.join("\n"),
      isRecommended: pkg.isRecommended,
      isActive: pkg.isActive,
      addGiftBalance: pkg.addGiftBalance,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      const formattedValues = {
        ...values,
        features: values.features
          .split("\n")
          .filter((feature) => feature.trim()),
      };

      const data = {
        id: selectedPackage?._id,
        data: {
          ...formattedValues,
        },
      };

      let response;
      if (selectedPackage) {
        response = await editPackage(data);
      } else {
        response = await addPackage(formattedValues);
      }

      if (response?.data?.success) {
        toast.success(
          selectedPackage
            ? "Package updated successfully"
            : "Package added successfully"
        );
        setIsModalOpen(false);
        form.resetFields();
        setSelectedPackage(null);
      }
    } catch (error) {
      toast.error(error?.message || "Failed to process package");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-center mb-8">Manage Packages</h1>
        <button
          onClick={() => {
            setSelectedPackage(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
          className="bg-[#EC4899] text-white px-4 py-2 rounded-md"
        >
          Add Package
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-5 bg-pink-50 p-5 rounded-xl">
        {allPackages?.map((pkg, i) => (
          <div className="relative" key={i}>
            <Card
              className="hover:shadow-xl transition-shadow flex flex-col h-full"
              title={
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{pkg.name}</span>
                  <Tag color="pink">{pkg.duration}</Tag>
                </div>
              }
            >
              <div className="mb-3">
                {pkg.isRecommended && <Tag color="green">Recommended</Tag>}
              </div>
              <p className="text-gray-600 mb-4">{pkg.description}</p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-pink-500">
                  ${pkg.price}
                </span>
                <span className="text-gray-500">/{pkg.duration}</span>
              </div>
              <div className="mb-14">
                <h3 className="font-semibold mb-2">Features:</h3>
                <ul className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircleOutlined className="text-pink-500 mt-1" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="absolute bottom-5 w-[90%]">
                <Button
                  type="primary"
                  onClick={() => handleEdit(pkg)}
                  icon={<EditOutlined />}
                  className="w-full bg-pink-500 hover:bg-pink-600 mt-auto"
                >
                  Edit Package
                </Button>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <Modal
        title={selectedPackage ? "Edit Package" : "Add New Package"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setSelectedPackage(null);
        }}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Package Name"
            rules={[{ required: true, message: "Please input package name!" }]}
          >
            <Input placeholder="Enter package name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <TextArea rows={4} placeholder="Enter package description" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="price"
              label="Price"
              rules={[
                { required: true, message: "Please input price!" },
                {
                  type: "number",
                  min: 0,
                  message: "Price must be greater than 0!",
                },
              ]}
            >
              <InputNumber
                className="w-full"
                prefix="$"
                placeholder="Enter price"
              />
            </Form.Item>

            <Form.Item
              name="duration"
              label="Duration"
              rules={[{ required: true, message: "Please select duration!" }]}
            >
              <Select placeholder="Select duration">
                <Select.Option value="month">Month</Select.Option>
                <Select.Option value="year">Year</Select.Option>
                <Select.Option value="7 days">Free</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="paymentType"
              label="Payment Type"
              rules={[
                { required: true, message: "Please select payment type!" },
              ]}
            >
              <Select placeholder="Select payment type">
                <Select.Option value="Paid">Paid</Select.Option>
                <Select.Option value="Free">Free</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please input category!" }]}
            >
              <Input placeholder="Enter category" />
            </Form.Item>
          </div>

          <Form.Item
            name="features"
            label="Features (One per line)"
            rules={[{ required: true, message: "Please input features!" }]}
          >
            <TextArea rows={6} placeholder="Enter features (one per line)" />
          </Form.Item>

          <Form.Item
            name="isRecommended"
            label="Recommended Package"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Show on Homepage"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>

          {/* Gift Balance Selection */}
          <div className="mb-4">
            <label className="block mb-2">Gift Balance Amount</label>
            <Space>
              <Button
                type={form.getFieldValue('addGiftBalance') === 5 ? 'primary' : 'default'}
                onClick={() => form.setFieldsValue({ addGiftBalance: 5 })}
                className={form.getFieldValue('addGiftBalance') === 5 ? 'bg-pink-500' : ''}
              >
                $5
              </Button>
              <Button
                type={form.getFieldValue('addGiftBalance') === 10 ? 'primary' : 'default'}
                onClick={() => form.setFieldsValue({ addGiftBalance: 10 })}
                className={form.getFieldValue('addGiftBalance') === 10 ? 'bg-pink-500' : ''}
              >
                $10
              </Button>
            </Space>
          </div>

          <Form.Item
            name="addGiftBalance"
            label="Gift Balance"
            className="mb-4"
          >
            <InputNumber
              className="w-full"
              prefix="$"
              readOnly
              placeholder="Selected gift balance amount"
            />
          </Form.Item>

          <Form.Item className="flex justify-end mb-0">
            <Space>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  form.resetFields();
                  setSelectedPackage(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-pink-500"
                loading={isEditLoading}
              >
                {selectedPackage ? "Update Package" : "Add Package"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PackagePage;
