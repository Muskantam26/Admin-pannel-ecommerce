
import React from "react";

const Button = ({
  title,
  bg = "bg-(--bs-btn)",
  text = "text-(--text-white)",
  onClick,
  className = "",
  children,
}) => {
  return (
    <button

      onClick={onClick}
      className={`
        ${bg} ${text} cursor-pointer transition transform hover:scale-105 ${className}`}
    >
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
