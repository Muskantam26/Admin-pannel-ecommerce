
import React from "react";

const Button = ({
  title,
  bg = "bg-(--bs-btn)",
  text = "text-(--text-white)",
  icon,
  onClick,
  className = "",
  children,
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        ${bg} ${text} flex items-center justify-center gap-2 px-5 py-2 md:py-2.5 rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:shadow-lg active:scale-95 ${className}`}
    >
      {icon}
      {children || title}
    </button>
  );
};

export default Button;





export const ActionButton = ({
  title = "Edit Products",
  onClick,
  icon,
  bg = "bg-(--bg-box)",
  textColor = "text-black",
  rounded = "rounded-xl",
  padding = "p-1",
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`${bg} ${textColor}  ${rounded} ${padding}  cursor-pointer  items-center justify-center gap-2  hover:shadow-md transition duration-200 ${className}`}
    >
      {icon}
      <span className="text-xs ">{title}</span>
    </button>

  );
};
