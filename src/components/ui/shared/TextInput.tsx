"use client";

import { Form, Input } from "antd";
import React from "react";

const TextInput: React.FC<{ name: string; label: string }> = ({
  name,
  label,
}) => {
  return (
    <Form.Item
      name={name}
      label={<p className="text-black text-[16px]">{label}</p>}
      rules={[
        {
          required: true,
          message: `Please enter your ${label.toLowerCase()}`,
        },
      ]}
    >
      <Input
        placeholder={`Enter your ${label.toLowerCase()}`}
        style={{
          height: 48,
          border: "1px solid #d9d9d9",
          outline: "none",
          boxShadow: "none",
          backgroundColor: "white",
        }}
      />
    </Form.Item>
  );
};

export default TextInput;
