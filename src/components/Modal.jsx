"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react"; // Import useEffect

export default function Modal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; 
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-backdrop") {
      onClose();
    }
  };

  return (
    <div
      id="modal-backdrop"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleOutsideClick}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-white rounded-2xl shadow-lg p-6 w-[794px] text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-400  border border-black px-[10px] rounded-full pb-1 hover:text-red-500 text-2xl font-bold"
          >
            &times;
          </button>
        </div>
        <div className="flex flex-col w-[606px] py-[50px] justify-center mx-auto items-center">
          <div className="bg-green-500 text-white rounded-full p-4 mb-4">
            <Image src={"/icons/success.png"} width={150} height={150} alt="Success icon" />
          </div>
          <h2 className="text-[24px] font-semibold leading-[32px] text-[#F82BA9]">
            Product published successfully!
          </h2>
          <p className="text-[#65728E] font-medium text-base leading-[25px] mt-2">
            Your product is now live. You can edit or manage it anytime from the Product page.
          </p>
        </div>
      </motion.div>
    </div>
  );
}