"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Modal from "../../../../components/Modal";
import InputField from "../../../../components/reusable/InputField";
import TextAreaField from "../../../../components/reusable/TextAreaField";
import TagsInput from "../../../../components/reusable/TagsInput";
import SelectField from "../../../../components/reusable/SelectField";
import FileUpload from "../../../../components/reusable/FileUpload";
import RadioButton from "../../../../components/reusable/RadioButton";

export default function ProductForm() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    additionalInfo: "",
    category: "",
    size: "",
    colors: [],
    tags: [],
    regularPrice: "",
    discountPrice: "",
    availability: "in-stock",
    featureImage: null,
    additionalImages: null,
  });

  const [openResponsive, setOpenResponsive] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const featureImageRef = useRef(null);
  const additionalImagesRef = useRef(null);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      additionalInfo: "",
      category: "",
      size: "",
      colors: [],
      tags: [],
      regularPrice: "",
      discountPrice: "",
      availability: "in-stock",
      featureImage: null,
      additionalImages: null,
    });

    // Clear file inputs
    if (featureImageRef.current) featureImageRef.current.value = "";
    if (additionalImagesRef.current) additionalImagesRef.current.value = "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTagChange = (newTags) => {
    setFormData((prev) => ({ ...prev, tags: newTags }));
  };

  const handleColorSelect = (color) => {
    setSelectedColor(selectedColor === color ? null : color);
  };

  const handleFileChange = (e, id) => {
    const file = e?.target?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        document.getElementById(id).src = reader.result;
        document.getElementById(id).style.display = "block";
      };
      reader.readAsDataURL(file);
      setFormData({
        ...formData,
        [id === "preview" ? "featureImage" : "additionalImages"]: file,
      });
    }
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.description &&
      formData.additionalInfo &&
      formData.category &&
      formData.size &&
      formData.tags.length > 0 &&
      formData.regularPrice &&
      formData.availability &&
      formData.featureImage
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      setOpenResponsive(true);
    } else {
      // alert("Please fill all required fields.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <form onSubmit={handleSubmit} className="flex gap-4 p-6 rounded-2xl">
        <div className="w-[504px] space-y-4 bg-white shadow-lg p-6 rounded-lg">
          <InputField
            label="Product Name"
            name="name"
            placeholder="Enter product name"
            value={formData.name}
            onChange={handleInputChange}
          />

          <TextAreaField
            label="Description"
            name="description"
            placeholder="Write product description"
            value={formData.description}
            onChange={handleInputChange}
          />

          <TextAreaField
            label="Additional Information"
            name="additionalInfo"
            placeholder="Write additional information"
            value={formData.additionalInfo}
            onChange={handleInputChange}
          />

          <SelectField
            label="Product Category"
            name="category"
            placeholder="Product Category"
            value={formData.category}
            onChange={handleInputChange}
            options={[
              { value: "Electronics", label: "Electronics" },
              { value: "Fashion", label: "Fashion" },
              { value: "Home", label: "Home" },
            ]}
          />

          <SelectField
            label="Size"
            name="size"
            placeholder="Size"
            value={formData.size}
            onChange={handleInputChange}
            options={[
              { value: "Small", label: "Small" },
              { value: "Medium", label: "Medium" },
              { value: "Large", label: "Large" },
            ]}
          />

          <div>
            <label className="block">
              Color <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-2">
              {["blue", "green", "purple", "yellow", "red"].map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full border ${
                    selectedColor === color ? "ring-2 ring-gray-600" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
            </div>
          </div>

          <TagsInput
            label="Tags"
            name="tags"
            value={formData.tags}
            onChange={handleTagChange}
          />
        </div>

        <div className="w-[504px]">
          <div className="space-y-6 bg-white shadow-lg p-6 rounded-lg">
            <div className="flex items-center gap-6">
              <FileUpload
                label="Feature Image"
                id="preview"
                onChange={handleFileChange}
                ref={featureImageRef}
              />
              <FileUpload
                label="Additional Images"
                id="additionalPreview"
                onChange={handleFileChange}
                ref={additionalImagesRef}
              />
            </div>

            <InputField
              label="Regular Price"
              name="regularPrice"
              type="number"
              placeholder="Enter Regular Price"
              value={formData.regularPrice}
              onChange={handleInputChange}
            />

            <InputField
              label="Discount Price"
              name="discountPrice"
              type="number"
              placeholder="Enter Discount Price"
              value={formData.discountPrice}
              onChange={handleInputChange}
            />

            <div className="flex flex-col gap-2">
              <label className="block text-base leading-[24px]">
                Availability<span className="text-[#F82BA9]">*</span>
              </label>
              <div className="flex flex-col gap-[5px]">
                <RadioButton
                  label="In Stock"
                  name="availability"
                  value="in-stock"
                  checked={formData.availability === "in-stock"}
                  onChange={handleInputChange}
                />
                <RadioButton
                  label="Out of Stock"
                  name="availability"
                  value="out-of-stock"
                  checked={formData.availability === "out-of-stock"}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              className="px-10 py-2 border text-base border-[#F82BA9] rounded-md text-[#F82BA9] transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={() => setModalOpen(true)}
              className={`px-6 py-2 bg-[#F82BA9] text-base text-white rounded-md transition-all duration-200 
              }`}
            >
              Publish Product
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
