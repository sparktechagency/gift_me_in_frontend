"use client";
import { Select } from "antd";

const SelectField = ({ label, name, options, value, onChange, placeholder, required = false }) => (
  <div className="space-y-2">
    <label className="block">{label} {required && <span className="text-red-500">*</span>}</label>
    <Select
      placeholder={placeholder}
      style={{ width: "100%", height: "42px", outline: "none" }}
      value={value}
      onChange={(value) => onChange({ target: { name, value } })}
      options={options}
      required={required}
    />
  </div>
);

export default SelectField;