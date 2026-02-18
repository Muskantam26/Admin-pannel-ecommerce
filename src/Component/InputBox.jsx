import React from "react";
import { IoIosSearch } from "react-icons/io";

const InputBox = ({
  placeholder = "Search here",
  border = "border border-(--input-border)",
  className = "",
  onChange,
  value,
}) => {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-md ${border} ${className}`}
    >
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none border-none focus:outline-none focus:border-none"
      />

      <IoIosSearch size={22} className="text-(--text-second)" />
    </div>
  );
};

export default InputBox;
export const InputField = ({
  placeholder = "Search here",
  border = "border border-(--input-border)",
  className = "",
  onChange,
  value,
  type = "text",
  label,
  name,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-xs text-(--text-main) font-semibold">
          {label}
        </label>
      )}

      <div className={`px-3 py-2 rounded-md ${border} ${className}`}>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full outline-none text-xs bg-transparent"
          {...props}
        />
      </div>
    </div>
  );
};
