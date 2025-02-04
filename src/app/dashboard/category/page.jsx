"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Table from "../../../components/Table";
import { CategoryData } from "../../../../utils/CustomData";

const CATEGORY_HEAD = ["Image", "Category", "Stock", "Action"];

const InputField = ({ label, name, type = "text", placeholder, value, onChange, required = false }) => (
  <div className="space-y-2">
    <label className="block text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#F82BA9]"
    />
  </div>
);

const FileUpload = React.forwardRef(({ label, onChange, required = false }, ref) => {
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const fileUrl = URL.createObjectURL(file);
      setFilePreview(fileUrl);
      onChange(file);
    }
  };

  return (
    <div className="space-y-2 w-full">
      <label className="block text-gray-800">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="border-2 border-dashed p-8 text-center relative flex flex-col justify-center items-center transition-all duration-300 ease-in-out cursor-pointer border-[#f4aad8] hover:border-[#F82BA9]">
        <input
          type="file"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          required={required}
          accept="image/*"
          ref={ref}
        />
        {!filePreview ? (
          <Image src="/icons/upload.png" width={118} height={95} alt="Upload File" className="mx-auto" />
        ) : (
          <img src={filePreview} alt="Uploaded File" className="mt-4 mx-auto max-h-40 object-contain" />
        )}
      </div>
    </div>
  );
});

FileUpload.displayName = "FileUpload";

const Page = () => {
  const featureImageRef = useRef(null);
  const [formData, setFormData] = useState({ name: "", featureImage: null });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file) => {
    setFormData((prev) => ({ ...prev, featureImage: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.featureImage) {
      alert("Please fill in all required fields.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("featureImage", formData.featureImage);

    console.log(formData);
  };

  return (
    <section className="flex gap-3">
      {/* Categories Table */}
      <div className="p-6 w-full shadow-lg flex flex-col gap-6">
        <h3 className="text-[#160E4B] font-medium text-2xl">Category</h3>
        <Table bodyData={CategoryData} head={CATEGORY_HEAD} />
      </div>

      {/* Add Category Form */}
      <div className="w-full flex flex-col gap-6 p-6">
        <h3 className="text-[#160E4B] font-medium text-2xl">Add Category</h3>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="shadow-lg p-6 flex flex-col gap-3">
            <InputField
              label="Category Name"
              name="name"
              placeholder="Enter category name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <FileUpload label="Category Image" onChange={handleFileChange} required ref={featureImageRef} />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              className="px-10 py-2 border border-[#F82BA9] text-[#F82BA9] rounded-md transition-all duration-200"
              aria-label="Cancel adding category"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-10 py-2 bg-[#F82BA9] text-white rounded-md transition-all duration-200"
              aria-label="Submit category"
            >
              Publish
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Page;
