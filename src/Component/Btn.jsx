import React from "react";

const Button = ({
  title,
  bg = "bg-(--bs-btn)",
  text = "text-(--text-white)",
  className = "",
}) => {
  return (
    <button
   
      className={`
        ${bg}   ${text} cursor-pointer ${className}`}
    >
      {title}
    </button>
  );
};

export default Button;
