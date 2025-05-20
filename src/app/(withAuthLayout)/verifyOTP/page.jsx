"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Form, Input, message, Spin } from "antd";
import { useVerifyEmailMutation } from "../../../redux/apiSlice/authSlice";

// Create a separate component that uses useSearchParams
const VerifyOTPContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [form] = Form.useForm();
  const [verifyOTP, { isLoading }] = useVerifyEmailMutation();
  const [timer, setTimer] = useState(180); // Changed to 180 seconds (3 minutes)
  const timerRef = useRef(null);

  // Input refs for OTP fields - reduced to 4
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    // Focus on first input when component mounts
    inputRefs[0].current?.focus();

    // Start timer
    startTimer();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = () => {
    setTimer(180); // Changed to 180 seconds

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const handleInputChange = (e, index) => {
    const { value } = e.target;

    // Only allow numbers
    const sanitizedValue = value.replace(/[^0-9]/g, "");

    // Update the current input
    const formValues = form.getFieldsValue();
    formValues[`digit${index + 1}`] = sanitizedValue.slice(0, 1);
    form.setFieldsValue(formValues);

    // Auto-focus next input if value is entered
    if (sanitizedValue && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace to go to previous input
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, 4);

    if (pastedData) {
      const formValues = {};

      for (let i = 0; i < 4; i++) {
        formValues[`digit${i + 1}`] = pastedData[i] || "";
      }

      form.setFieldsValue(formValues);

      // Focus on the last filled input or the next empty one
      const lastIndex = Math.min(pastedData.length, 3);
      inputRefs[lastIndex].current?.focus();
    }
  };

  const handleVerify = async (values) => {
    try {
      const otp = Object.values(values).join("");

      if (otp.length !== 4) {
        return message.error("Please enter all 4 digits of the OTP");
      }

      // Format the data according to the required structure
      const verificationData = {
        email: email,
        oneTimeCode: parseInt(otp), // Convert string to number
      };

      console.log(verificationData);

      const response = await verifyOTP(verificationData).unwrap();

      if (response.success) {
        message.success("OTP verified successfully");
        router.push("/");
      } else {
        message.error(response.message || "Verification failed");
      }
    } catch (error) {
      message.error(error?.data?.message || "Failed to verify OTP");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Verify Your Email
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a 4-digit code to {email || "your email"}
          </p>
        </div>

        <Form
          form={form}
          name="otpForm"
          onFinish={handleVerify}
          layout="vertical"
        >
          <div className="flex justify-center space-x-2 mb-6">
            {[...Array(4)].map((_, index) => (
              <Form.Item
                key={index}
                name={`digit${index + 1}`}
                className="mb-0"
              >
                <Input
                  ref={inputRefs[index]}
                  className="w-12 h-12 text-center text-xl font-bold"
                  maxLength={1}
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : undefined}
                />
              </Form.Item>
            ))}
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="w-full h-10 bg-[#EC4899] hover:bg-pink-600"
            >
              Verify
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Time remaining:{" "}
            <span className="text-gray-500">
              {Math.floor(timer / 60)}:
              {(timer % 60).toString().padStart(2, "0")} minutes
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

// Main page component with Suspense
const VerifyOTPPage = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <Spin />
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  );
};

export default VerifyOTPPage;
