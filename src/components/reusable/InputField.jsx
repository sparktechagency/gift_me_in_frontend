const InputField = ({ label, name, type = "text", placeholder, value, onChange, required = false }) => (
  <div className="space-y-2">
    <label className="block">{label} {required && <span className="text-red-500">*</span>}</label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full p-2 outline-none border rounded"
    />
  </div>
);


export default InputField;