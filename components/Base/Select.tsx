import React, { useState, useRef, useEffect } from "react";
import FormGroup from "./FormGroup";
import { FiChevronDown } from "react-icons/fi";
import { div } from "framer-motion/client";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <FormGroup label={label} required={required} value={value}>
      <div ref={ref} className="relative">
        <button
          type="button"
          name={name}
          disabled={disabled}
          onClick={() => setOpen((prev) => !prev)}
          className={`w-full flex justify-between items-center rounded-md text-sm ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
            }`}
        >
          <div className="w-full flex justify-between items-center px-1">
            <span className={value ? "text-black" : "text-gray-400"}>
              {selectedLabel || ``}
            </span>
            <FiChevronDown
              className={`ml-2 h-4 w-4 transition-transform duration-150 ${open ? "rotate-180" : ""
                }`}
            />
          </div>
        </button>

        {open && (
          <ul className="absolute z-10 mt-3 w-72 bg-white  rounded-md shadow-sm max-h-60 overflow-y-auto text-sm">
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`px-3 py-2 cursor-pointer hover:bg-blue-50 ${opt.value === value ? "bg-blue-100 font-medium" : ""
                  }`}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </FormGroup>
  );
};

export default Select;
