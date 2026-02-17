const Select = ({ label, options = [], ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-(--text-second)">{label}</label>
    <select
      {...props}
      className="border border-(--input-border) bg-(--input-bg) rounded-lg px-3 py-2 focus:outline-none focus:border-none w-full"
    >
      <option value="">Select your product</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

export default Select;
