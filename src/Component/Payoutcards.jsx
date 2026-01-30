import React from "react";

const Payoutcards = ({ icon: Icon, value, label }) => {
  return (
    <div className="bg-(--bg-main) min-h-20 rounded-3xl flex items-center gap-3 px-4">
      
      {/* Icon */}
      <div className="h-10 w-10 rounded-full bg-(--bg-white) flex items-center justify-center shadow-sm">
        {Icon && <Icon size={18} className="text-(--primary)" />}
      </div>

      {/* Text */}
      <div>
        <h3 className="text-lg font-semibold text-(--text-main)">
          {value}
        </h3>
        <p className="text-xs font-medium text-(--text-third)">
          {label}
        </p>
      </div>

    </div>
  );
};

export default Payoutcards;
