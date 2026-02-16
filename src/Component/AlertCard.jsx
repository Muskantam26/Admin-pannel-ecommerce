import React from "react";

const AlertCard = ({
  icon,
  category,
  time,
  title,
  icontext="text-(--bs-icon-sec)",
  description,
  severity,
  borderColor = "border-red-400",
  bgColor = "bg-(--bg-box)",
  badgeColor = "bg-red-500",
}) => {
  return (
    <div
      className={`flex justify-between items-start p-4 rounded-lg border ${borderColor} ${bgColor}`}
    >
      {/* Left Content */}
      <div className="flex gap-4">
        {/* Icon */}
        <div className={` text-xl ${icontext} `}>{icon}</div>

        {/* Text Content */}
        <div>
          <p className="text-[9px] text-gray-500 uppercase tracking-wide">
            {category} • {time}
          </p>

          <h2 className="text-xs font-semibold mt-1">{title}</h2>

          <p className="text-(--text-second) text-[9px] mt-1">{description}</p>
        </div>
      </div>

      {/* Severity Badge */}
      <span
        className={`text-(--text-white) text-[9px] p-1 px-5  rounded-sm ${badgeColor}`}
      >
        {severity}
      </span>
    </div>
  );
};

export default AlertCard;
