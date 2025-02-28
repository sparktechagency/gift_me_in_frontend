"use client";

import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Checkbox } from "antd";
import "antd/dist/reset.css";
import Image from "next/image";
import logo from "../../../../../public/logo.svg";
import toast from "react-hot-toast";

const LoginModal: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const loggedIn = sessionStorage.getItem("isLoggedIn");
    if (!loggedIn) {
      setIsModalVisible(true);
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLogin = (values: { email: string; password: string }) => {
    sessionStorage.setItem("isLoggedIn", "true");
    toast.success("Login Successful");
    setIsModalVisible(false);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="relative">
      {isModalVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-black opacity-70 z-10"></div>
      )}

      <Modal
        open={isModalVisible}
        closable={false}
        footer={null}
        centered
        className="z-20"
      >
        <div className="py-10">
          <div className="flex items-center justify-center">
            <Image
              className="w-40 h-20 my-5"
              src={logo}
              width={120}
              height={80}
              alt="Logo"
            />
          </div>
          <p className="text-xl text-center">
            Welcome back! Please log in to continue.
          </p>
          <div className="mt-6">
            <Form
              name="login"
              onFinish={handleLogin}
              autoComplete="off"
              className="w-full"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
                  style={{ height: "50px" }}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  placeholder="Password"
                  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
                  style={{ height: "50px" }}
                />
              </Form.Item>
              <div className="flex justify-between items-center mb-6">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember Password</Checkbox>
                </Form.Item>
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  Forget Password?
                </a>
              </div>
              <Form.Item>
                <button
                  type="submit"
                  className="bg-primary hover:bg-blue-700 text-xl font-semibold text-white px-6 py-2 rounded w-full"
                >
                  Log In
                </button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LoginModal;
