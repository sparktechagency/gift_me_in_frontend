"use client";

import { Checkbox, Form, Input } from "antd";

import { useRouter } from "next/navigation";
import React from "react";
import TextInput from "../../shared/TextInput";
import { useLoginMutation } from "../../../../redux/apiSlice/authSlice";
import toast from "react-hot-toast";

const Login = () => {
  const [remember, setRemember] = React.useState(false);
  const router = useRouter();

  const [login, isLoading] = useLoginMutation();

  const onFinish = async (values: { email: string; password: string }) => {
    //console.log(values);
    try {
      const res = await login(values).unwrap();

      if (res?.data?.role !== "ADMIN" && res?.data?.role !== "SUPER_ADMIN") {
        toast.error("You are not authorized to access this page");
        return;
      }
      if (res?.success) {
        if (remember) {
          localStorage.setItem("authenticationToken", res?.data?.createToken);
          localStorage.setItem("role", res?.data?.role);
        } else {
          sessionStorage.setItem("authenticationToken", res?.data?.createToken);
          sessionStorage.setItem("role", res?.data?.role);
        }
        toast.success(res?.message);
        setTimeout(() => {
          if (res?.data?.role === "ADMIN") {
            router.replace(`/verifyOTP?email=${values.email}`);
          } else {
            router.replace("/");
          }
        }, 500);
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <div>
      <div className=" mb-6">
        <h1 className="text-[25px] font-semibold mb-2">
          Log in to your account
        </h1>
        <p className="text-primary">
          {" "}
          Please enter your email and password to continue
        </p>
      </div>
      <Form onFinish={onFinish} layout="vertical">
        <TextInput name={"email"} label={"Email"} />

        <Form.Item
          name="password"
          label={<p>Password</p>}
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input.Password
            type="password"
            placeholder="Enter your password"
            style={{
              height: 40,
              border: "1px solid #d9d9d9",
              outline: "none",
              boxShadow: "none",
            }}
          />
        </Form.Item>

        <div className="flex items-center justify-between">
          <Form.Item
            style={{ marginBottom: 0 }}
            name="remember"
            valuePropName="checked"
          >
            <Checkbox
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            >
              Remember me
            </Checkbox>
          </Form.Item>

          <a
            className="login-form-forgot text-primary font-semibold"
            href="/forgot-password"
          >
            Forgot password
          </a>
        </div>

        <Form.Item style={{ marginBottom: 0 }}>
          <button
            type="submit"
            style={{
              width: "100%",
              height: 45,
              color: "white",
              fontWeight: "400px",
              fontSize: "18px",
              backgroundColor: "#fc6480",
              marginTop: 20,
            }}
            className="flex items-center justify-center bg-primary rounded-lg"
          >
            {/* {isLoading ? "Signing in..." : "Sign in"} */}
            Sign in
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
