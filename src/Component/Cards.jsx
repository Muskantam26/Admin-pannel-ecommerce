import React from "react";

import { GoChevronDown } from "react-icons/go";

const Card = ({ title, subtitle, value, period }) => {
  return (
    <div className="bg-(--bg-box) p-1 rounded-2xl ">
    <div className="rounded-2xl p-2 min-h-42  grediant-img  flex flex-col space-y-2 ">
      
      {/* Top */}
      <div className="flex items-start justify-between ml-5">
        <div className="mt-10">
          <p className="text-xs text-(--text-main) uppercase tracking-wide font-medium">
            {title}
          </p>
          <p className="text-[9px] text-(--text-third) mt-1">
            {subtitle}
          </p>
        </div>
        <button className="text-[10px] bg-(--bg-btn) p-2 rounded-md  text-(--text-main) flex gap-0 items-center justify-center cursor-pointer ">
          {period }<GoChevronDown /> 
        </button>
      </div>

      {/* Amount */}
      <h2 className="text-3xl  text-(--text-main) ml-5 ">
        ₹{value}
      </h2>
    </div>
    </div>
  );
};



export default Card;

