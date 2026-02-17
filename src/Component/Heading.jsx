import React from "react";

export const Heading = ({
  title,
  subtitle,
  titleSize = "md:text-xl",
  subtitleSize = "md:text-xs",
  align = "left",
}) => {
  return (
    <div className={` ${align === "center" ? "text-center" : "text-left"}`}>
      <h1 className={`${titleSize}  text-sm font-medium text-(--text-main)`}>
        {title}
      </h1>
      {subtitle && (
        <p className={`${subtitleSize} text-xs font-semibold text-(--text-second)`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};




export const MainHeading = ({ title, subtitle }) => {
  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-(--text-main)">
        {title}
      </h1>

      {subtitle && (
        <p className="text-(--text-third) text-xs font-medium mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
};



