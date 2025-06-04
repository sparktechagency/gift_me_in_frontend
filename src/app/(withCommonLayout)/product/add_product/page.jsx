"use client";

import React from "react";
import { Form, Input, Button, Select, Upload, message, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAddProductMutation } from "../../../../redux/apiSlice/productSlice";
import toast from "react-hot-toast";
import { useGetCategoriesQuery } from "../../../../redux/apiSlice/categorySlice";
import { useRouter } from "next/navigation";
import { useGetEventCategoriesQuery } from "../../../../redux/apiSlice/eventSlice";
const { TextArea } = Input;
const { Option } = Select;

const AddProducts = () => {
  const [form] = Form.useForm();
  const { data: categories, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  const { data: events, isLoading: eventsLoading } =
    useGetEventCategoriesQuery();

  const [addProduct] = useAddProductMutation();

  const router = useRouter();

  if (categoriesLoading || eventsLoading) {
    return <h1>Loading...</h1>;
  }

  const eventsList = events?.data;
  console.log(eventsList);
  const categoriesList = categories?.data?.data;
  //console.log(categoriesList);

  // Handle image upload validation
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG files!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  // Handle form submission
  const onFinish = async (values) => {
    const formData = new FormData();
    try {
      //console.log(values);

      // Append text fields to FormData
      Object.keys(values).forEach((key) => {
        if (key === "feature" || key === "additional") {
          // Skip appending images here; they are handled separately below
          return;
        }
        formData.append(key, values[key]);
      });

      // Append feature image
      if (values.feature && values.feature.length > 0) {
        formData.append("feature", values.feature[0].originFileObj);
        // //console.log("argbsdfhsrthb", values.feature[0].originFileObj);
      }

      // Append additional images
      if (values.additional && values.additional.length > 0) {
        values.additional.forEach((file, index) => {
          formData.append(`additional`, file.originFileObj);
        });
      }

      // Call the API mutation with FormData
      const res = await addProduct(formData).unwrap();
      //console.log(res);
      if (res?.success) {
        toast.success("Product added successfully!");
        router.push("/product");
      } else {
        toast.error("Failed to add product!");
      }
    } catch (error) {
      //console.log(error);
      toast.error("Failed to add product!");
    }
  };

  return (
    <div className="p-8 bg-pink-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-pink-600">
        Add New Product
      </h1>
      <Form
        form={form}
        name="add_product"
        onFinish={onFinish}
        layout="vertical"
        className="w-full mx-auto bg-white p-8 rounded-lg shadow-md"
      >
        {/* Two-column layout using Ant Design Row and Col */}
        <Row gutter={24}>
          {/* Left Column */}
          <Col span={12}>
            {/* Product Name */}
            <Form.Item
              label="Product Name"
              name="productName"
              rules={[
                { required: true, message: "Please input the product name!" },
              ]}
            >
              <Input placeholder="Enter product name" />
            </Form.Item>

            {/* Description */}
            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please input the description!" },
              ]}
            >
              <TextArea rows={4} placeholder="Enter product description" />
            </Form.Item>

            {/* Product Category */}
            <Form.Item
              label="Product Category"
              name="category"
              rules={[{ required: true, message: "Please select a category!" }]}
            >
              <Select placeholder="Select a category">
                {categoriesList?.map((category) => (
                  <Option key={category._id} value={category?.categoryName}>
                    {category.categoryName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Event Category"
              name="eventCategory"
              rules={[
                { required: true, message: "Please select a event category!" },
              ]}
            >
              <Select placeholder="Select a category">
                {eventsList?.map((category) => (
                  <Option key={category?._id} value={category?._id}>
                    {category?.eventCategory}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Size (Array of Strings) */}
            <Form.Item
              label="Size"
              name="size"
              rules={[
                { required: true, message: "Please input at least one size!" },
              ]}
            >
              <Select mode="tags" placeholder="Enter sizes (e.g., S, M, L)" />
            </Form.Item>

            {/* Color (Array of Strings) */}
            <Form.Item
              label="Color"
              name="color"
              rules={[
                { required: true, message: "Please input at least one color!" },
              ]}
            >
              <Select
                mode="tags"
                placeholder="Enter colors (e.g., Red, Blue)"
              />
            </Form.Item>

            {/* Tag (Array of Strings) */}
            <Form.Item
              label="Tags"
              name="tag"
              rules={[
                { required: true, message: "Please input at least one tag!" },
              ]}
            >
              <Select mode="tags" placeholder="Enter tags (e.g., New, Sale)" />
            </Form.Item>
          </Col>

          {/* Right Column */}
          <Col span={12}>
            {/* Feature Image */}
            <Form.Item
              label="Feature Image"
              name="feature"
              rules={[
                { required: true, message: "Please upload a feature image!" },
              ]}
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList}
            >
              <Upload
                listType="picture-card"
                beforeUpload={beforeUpload}
                maxCount={1}
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>

            {/* Additional Images */}
            <Form.Item
              label="Additional Images"
              name="additional"
              rules={[
                {
                  required: false,
                  message: "Please upload additional images!",
                },
              ]}
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList}
            >
              <Upload
                listType="picture-card"
                beforeUpload={beforeUpload}
                multiple
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>

            {/* Regular Price */}
            <Form.Item
              label="Regular Price"
              name="regularPrice"
              rules={[
                { required: true, message: "Please input the regular price!" },
              ]}
            >
              <Input type="number" placeholder="Enter regular price" />
            </Form.Item>

            {/* Discounted Price */}
            <Form.Item
              label="Discounted Price"
              name="discountedPrice"
              rules={[
                {
                  required: false,
                  message: "Please input the discounted price!",
                },
              ]}
            >
              <Input type="number" placeholder="Enter discounted price" />
            </Form.Item>

            {/* Availability */}
            <Form.Item
              label="Availability"
              name="availability"
              rules={[
                { required: true, message: "Please select availability!" },
              ]}
            >
              <Select placeholder="Select availability">
                <Option value="inStock">In Stock</Option>
                <Option value="outOfStock">Out of Stock</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            className="bg-pink-600 !py-5 hover:bg-pink-700"
          >
            Add Product
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProducts;
