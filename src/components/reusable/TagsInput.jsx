"use client";
import { useState } from "react";

const TagsInput = ({ label, name, value, onChange }) => {
    const [inputValue, setInputValue] = useState("");
    const [tags, setTags] = useState(value || []);
  
    const handleInputChange = (e) => {
      setInputValue(e.target.value);
    };
  
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && inputValue.trim()) {
        e.preventDefault();
        const newTags = [...tags, inputValue.trim()];
        setTags(newTags);
        setInputValue("");
        onChange(newTags); // Pass updated tags to parent component
      }
    };
  
    const removeTag = (index) => {
      const newTags = tags.filter((_, i) => i !== index);
      setTags(newTags);
      onChange(newTags);
    };
  
    return (
      <div className="flex flex-col">
        <label className="mb-1 font-normal text-base">{label}</label>
        <div className="flex flex-wrap gap-2 border p-2 rounded-md">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-[#F82BA9] text-white text-xs px-2 py-1 rounded-md flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 text-xs font-bold"
              >
                ✕
              </button>
            </span>
          ))}
          <input
            type="text"
            name={name}
            placeholder="Add tags..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 outline-none"
          />
        </div>
      </div>
    );
  };

  
  export default TagsInput ;