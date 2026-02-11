const SelectOption = ({
  label,
  options = [],
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="text-xs text-[--text-main] font-semibold">
        {label}
      </label>

      <select
        className="w-full border border-(--input-border) mt-1 p-2 rounded text-xs text-(--text-third) outline-none focus:ring-0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Choose</option>

        {options.map((item, index) => (
          <option key={index} value={item} className="text-(--text-second)  ">
            {item}
          </option> 
        ))}
      </select>
    </div>
  );
};

export default SelectOption;
