"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useChangePasswordMutation } from "../../../../../redux/apiSlice/authSlice";
import { toast } from "react-hot-toast";

const FIELD_LABELS = {
  old: "Old Password",
  new: "New Password",
  confirm: "Confirm Password",
};

export default function PasswordUpdateForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onSubmit = async (data) => {
    try {
      // Format the data according to the required structure
      const passwordData = {
        currentPassword: data.old,
        newPassword: data.new,
        confirmPassword: data.confirm
      };

      const response = await changePassword(passwordData).unwrap();
      
      if (response.success) {
        toast.success(response.message || "Password updated successfully");
        reset(); // Reset form after successful update
      } else {
        toast.error(response.message || "Failed to update password");
      }
    } catch (error) {
      toast.error(error?.data?.message || "An error occurred while updating password");
      console.error("Password update error:", error);
    }
  };

  return (
    <div className="max-w-md bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-[#160E4B] text-2xl font-medium pb-4">
        Change Password
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {Object.keys(FIELD_LABELS).map((field) => (
          <div key={field} className="relative">
            <label htmlFor={field} className="block font-medium text-gray-700">
              {FIELD_LABELS[field]} <span className="text-[#F82BA9]">*</span>
            </label>
            <div className="relative">
              <input
                id={field}
                type={showPassword[field] ? "text" : "password"}
                placeholder="***********"
                {...register(field, {
                  required: "This field is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  validate:
                    field === "confirm"
                      ? (value) =>
                          value === watch("new") || "Passwords do not match"
                      : undefined,
                })}
                className="w-full px-4 py-2 border rounded outline-none"
                aria-label={FIELD_LABELS[field]}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility(field)}
                className="absolute inset-y-0 right-3 flex items-center"
                aria-label={`Toggle visibility for ${FIELD_LABELS[field]}`}
              >
                {showPassword[field] ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors[field] && (
              <p className="text-red-500 text-sm">{errors[field]?.message}</p>
            )}
          </div>
        ))}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2 border border-pink-500 text-pink-500 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-pink-500 text-white rounded-md disabled:opacity-70"
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
