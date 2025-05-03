"use client";
import {
  ConfigProvider,
  Space,
  Table,
  Modal,
  Form,
  Input,
  Tooltip,
  Select,
  Switch,
  Upload,
  message as antMessage,
} from "antd";
import {
  useAllUsersDataQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../../redux/apiSlice/userSlice";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaClipboardQuestion } from "react-icons/fa6";
import { UploadOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useSignUpMutation } from "../../../redux/apiSlice/authSlice";

const UsersPage = () => {
  const { data: usersData, isLoading, refetch } = useAllUsersDataQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [registerUser] = useSignUpMutation();
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // Update filtered data when userDetails changes
  useEffect(() => {
    setFilteredData(usersData?.data || []);
  }, [usersData?.data]);

  // Set form values when selectedUser changes
  useEffect(() => {
    if (selectedUser && isEditModalOpen) {
      editForm.setFieldsValue({
        name: selectedUser.name,
        email: selectedUser.email,
        phone: selectedUser.phone,
        status: selectedUser.status || "active",
        verified: selectedUser.verified || false,
      });

      // Set image preview if available
      if (selectedUser.image) {
        setImageUrl(selectedUser.image);
      } else {
        setImageUrl("");
      }

      // Reset file list
      setFileList([]);
    }
  }, [selectedUser, isEditModalOpen, editForm]);

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

  const handleEdit = (record) => {
    setSelectedUser(record);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (values) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add user ID
      formData.append("id", selectedUser._id);

      // Add all form values to FormData
      // Append all values except image
      Object.entries(values).forEach(([key, value]) => {
        if (key !== "image") {
          formData.append(key, value);
        }
      });

      // Add image file if exists
      if (fileList.length > 0) {
        formData.append("image", fileList[0].originFileObj);
      }

      // Log FormData entries for debugging (optional)
      // for (let pair of formData.entries()) {
      //   console.log(pair[0] + ': ' + pair[1]);
      // }

      const res = await updateUser(formData).unwrap();
      if (res?.success) {
        toast.success("User updated successfully");
        setIsEditModalOpen(false);
        // Reset upload state
        setFileList([]);
        setImageUrl("");
        // Update selected user with new data
        setSelectedUser((prev) => ({
          ...prev,
          image: res.data.image || prev.image,
          ...values,
        }));
        refetch();
      } else {
        toast.error(res?.message || "Failed to update user");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  // Image upload props
  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        antMessage.error("You can only upload image files!");
        return Upload.LIST_IGNORE;
      }

      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        antMessage.error("Image must be smaller than 2MB!");
        return Upload.LIST_IGNORE;
      }

      // Update fileList
      setFileList([file]);

      // Create proper UploadFile object
      const uploadFile = {
        uid: Date.now().toString(),
        name: file.name,
        status: "done",
        originFileObj: file,
      };

      setFileList([uploadFile]);

      // Prevent automatic upload
      return false;
    },
    fileList,
    onRemove: () => {
      setFileList([]);
      setImageUrl("");
    },
    maxCount: 1,
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
          src={
            image?.startsWith("http")
              ? image
              : `http://10.0.70.188:5004${image}`
          }
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
          <Tooltip title={"Edit User"}>
            <FaEdit
              className="text-xl cursor-pointer"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>

          <Tooltip title={"Survey Questions"}>
            <FaClipboardQuestion className="text-xl text-blue-600 cursor-pointer" />
          </Tooltip>

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

      {/* Add User Modal */}
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

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setFileList([]);
          setImageUrl("");
        }}
        footer={null}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateUser}
          className="mt-4"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input user name!" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item label="Profile Image" name="image">
            <div className="flex flex-col items-center space-y-4">
              {imageUrl && (
                <div className="mb-2">
                  <img
                    src={imageUrl}
                    alt="Profile Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
              <Upload {...uploadProps}>
                <button
                  type="button"
                  className="px-4 py-2 border rounded-md flex items-center"
                >
                  <UploadOutlined className="mr-2" />
                  {imageUrl ? "Change Image" : "Upload Image"}
                </button>
              </Upload>
            </div>
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
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select status!" }]}
          >
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
              <Select.Option value="blocked">Blocked</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Verified" name="verified" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item className="flex justify-end mb-0">
            <Space>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#EC4899] text-white rounded-md"
              >
                Update
              </button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersPage;
