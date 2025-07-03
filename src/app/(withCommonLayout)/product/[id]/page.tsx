"use client";

import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  message,
  Row,
  Col,
  Spin,
  Tag,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  useGetSingleProductQuery,
  useUpdateProductMutation,
} from "../../../../redux/apiSlice/productSlice";
import { useGetCategoriesQuery } from "../../../../redux/apiSlice/categorySlice";
import { useGetEventCategoriesQuery } from "../../../../redux/apiSlice/eventSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { imageUrl } from "../../../../redux/api/baseApi";

const { TextArea } = Input;
const { Option } = Select;

const EditProduct = ({ params }) => {
  const [form] = Form.useForm();
  const router = useRouter();

  const { data: categories, isLoading: categoriesLoading } =
    useGetCategoriesQuery(undefined);
  const { data: events, isLoading: eventsLoading } =
    useGetEventCategoriesQuery(undefined);
  const {
    data: singleProduct,
    isLoading: singleProductLoading,
    error: singleProductError,
  } = useGetSingleProductQuery(params.id);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const categoriesList = categories?.data?.data;
  const eventsList = events?.data;
  const IMAGE_BASE = imageUrl;

  useEffect(() => {
    if (singleProduct?.data) {
      const product = singleProduct.data;

      // Helper function to ensure arrays are properly formatted
      const formatArrayField = (field) => {
        if (!field) return [];
        if (Array.isArray(field)) return field;
        try {
          // Handle case where field might be a stringified array
          return typeof field === "string" ? JSON.parse(field) : [];
        } catch {
          return [];
        }
      };

      form.setFieldsValue({
        productName: product.productName,
        description: product.description,
        additionalInfo: product.additionalInfo,
        category: product.category,
        size: formatArrayField(product.size),
        color: formatArrayField(product.color),
        tag: formatArrayField(product.tag),
        regularPrice: product.regularPrice,
        discountedPrice: product.discountedPrice,
        availability: product.availability,
        feature: product.feature
          ? [
              {
                uid: "-1",
                name: product.feature.split("/").pop(),
                status: "done",
                url: `${IMAGE_BASE}${product.feature}`,
              },
            ]
          : [],
        additional:
          product.additional?.map((url, idx) => ({
            uid: `-${idx + 2}`,
            name: url.split("/").pop(),
            status: "done",
            url: `${IMAGE_BASE}${url}`,
          })) || [],
      });
    }
  }, [singleProduct, form, IMAGE_BASE]);

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    return (
      <Tag
        color="pink"
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  };

  if (categoriesLoading || eventsLoading || singleProductLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (singleProductError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error loading product data
      </div>
    );
  }

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

  const onFinish = async (values) => {
    const formData = new FormData();

    // Handle fields
    Object.entries(values).forEach(([key, val]) => {
      if (["feature", "additional"].includes(key)) return;

      if (["size", "color", "tag"].includes(key)) {
        formData.append(key, JSON.stringify(val));
      } else {
        formData.append(key, String(val)); // Changed this line
      }
    });

    // Feature image
    const featureFile = values.feature?.[0];
    if (featureFile?.originFileObj) {
      formData.append("feature", featureFile.originFileObj);
    } else if (featureFile?.url) {
      const existing = featureFile.url.replace(IMAGE_BASE, "");
      formData.append("existingFeature", existing);
    }

    // Additional images
    values.additional?.forEach((file) => {
      if (file.originFileObj) {
        formData.append("additional", file.originFileObj);
      } else if (file.url) {
        const existing = file.url.replace(IMAGE_BASE, "");
        formData.append("existingAdditional", existing);
      }
    });

    try {
      const res = await updateProduct({
        id: params.id,
        body: formData,
      }).unwrap();

      if (res?.success) {
        toast.success("Product updated successfully!");
        router.push("/product");
      } else {
        toast.error(res?.message || "Update failed!");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <div className="p-8 bg-pink-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-pink-600">
        Edit Product
      </h1>
      <Form
        form={form}
        name="edit_product"
        onFinish={onFinish}
        layout="vertical"
        className="w-full mx-auto bg-white p-8 rounded-lg shadow-md"
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Product Name"
              name="productName"
              rules={[
                { required: true, message: "Please input the product name!" },
              ]}
            >
              <Input placeholder="Enter product name" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please input the description!" },
              ]}
            >
              <TextArea rows={4} placeholder="Enter product description" />
            </Form.Item>

            <Form.Item
              label="Additional Info"
              name="additionalInfo"
              rules={[
                {
                  required: true,
                  message: "Please input the additional info!",
                },
              ]}
            >
              <TextArea rows={4} placeholder="Enter additional info" />
            </Form.Item>

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
              label="Size"
              name="size"
              rules={[
                { required: true, message: "Please input at least one size!" },
              ]}
            >
              <Select
                mode="tags"
                placeholder="Enter sizes (e.g., S, M, L)"
                tokenSeparators={[","]}
              />
            </Form.Item>

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
                tokenSeparators={[","]}
              />
            </Form.Item>

            <Form.Item
              label="Tags"
              name="tag"
              rules={[
                { required: true, message: "Please input at least one tag!" },
              ]}
            >
              <Select
                mode="tags"
                placeholder="Enter tags (e.g., New, Sale)"
                tokenSeparators={[","]}
                tagRender={tagRender}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
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
                accept="image/*"
              >
                {form.getFieldValue("feature")?.length >= 1 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Form.Item
              label="Additional Images"
              name="additional"
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList}
            >
              <Upload
                listType="picture-card"
                beforeUpload={beforeUpload}
                multiple
                accept="image/*"
              >
                {form.getFieldValue("additional")?.length >= 8 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Form.Item
              label="Regular Price"
              name="regularPrice"
              rules={[
                { required: true, message: "Please input the regular price!" },
              ]}
            >
              <Input type="number" placeholder="Enter regular price" />
            </Form.Item>

            <Form.Item label="Discounted Price" name="discountedPrice">
              <Input type="number" placeholder="Enter discounted price" />
            </Form.Item>

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

        <Form.Item>
          <div className="flex gap-4">
            <Button
              type="primary"
              htmlType="submit"
              loading={isUpdating}
              className="bg-pink-600 !py-5 hover:bg-pink-700 flex-1"
            >
              Update Product
            </Button>
            <Button
              htmlType="button"
              onClick={handleReset}
              className="!py-5 flex-1"
            >
              Reset
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProduct;
