"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const FileUpload = ({ label, id, onChange, required = false }) => {
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
    }

    onChange(e.target.files[0]); // Pass file to parent component
  };

  return (
    <div className="space-y-2 w-full">
      <label htmlFor={id} className="block text-base font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="border-dashed w-full border-2 border-[#f4aad8] p-8 text-center relative flex flex-col justify-center items-center hover:border-[#F82BA9] transition-all duration-300 ease-in-out cursor-pointer">
        <input
          type="file"
          id={id}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer"
          required={required}
          accept="image/*"
        />

        {!filePreview && (
          <div className="text-center">
            <Image
              src="/icons/upload.png"
              width={118}
              height={95}
              alt="Upload File"
              className="mx-auto"
            />
          </div>
        )}

        {filePreview && (
          <img
            src={filePreview}
            alt="Uploaded File"
            className="mt-4 mx-auto max-h-40 object-contain"
          />
        )}
      </div>
    </div>
  );
};

export default FileUpload;
