import React from "react";
import { FaAngleDown } from "react-icons/fa";

const Card = ({ title, subtitle, value, period }) => {
  return (
    <div className="bg-(--bg-box) p-1 rounded-2xl">
    <div className="rounded-2xl p-5 card-box shadow-sm min-h-40 flex flex-col justify-between">
      
      {/* Top */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-(--text-main) uppercase tracking-wide">
            {title}
          </p>
          <p className="text-xs text-(--text-third) mt-1">
            {subtitle}
          </p>
        </div>

        <button className="text-xs bg-(--bg-btn) px-4 py-1 rounded-md shadow-sm text-(--text-second) flex gap-2 items-center  cursor-pointer">
          {period }<FaAngleDown /> 
        </button>
      </div>

      {/* Amount */}
      <h2 className="text-3xl  text-(--text-main) mt-4">
        ₹{value}
      </h2>
    </div>
    </div>
  );
};

export default Card;
