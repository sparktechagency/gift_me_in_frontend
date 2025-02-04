const TextAreaField = ({ label, name, placeholder, value, onChange, required = false }) => (
  <div className="space-y-2">
    <label className="block">{label} {required && <span className="text-red-500">*</span>}</label>
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full outline-none p-2 border rounded resize-none"
    />
  </div>
);

export default TextAreaField;