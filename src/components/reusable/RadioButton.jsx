const RadioButton = ({ label, name, value, checked, onChange, required = false }) => (
  <label className="mr-4">
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="radio-btn select-none"
      required={required}
    /> {label}
  </label>
);


export default RadioButton;