import React from "react";

interface CTAProps {
  title: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "py-4 md:px-6 text-lg",
  md: "py-6 md:px-8 text-xl",
  lg: "py-8 md:px-10 text-3xl",
};

const CTA: React.FC<CTAProps> = ({ title, size = "sm" }) => {
  return (
    <div
      className={`border-2 rounded-lg shadow-lg bg-gray-700 p-8`}
    >
      <div
        className={`font-bold text-white text-center ${sizeMap[size]}`}
      >
        {title}
      </div>
    </div>
  );
};

export default CTA;
