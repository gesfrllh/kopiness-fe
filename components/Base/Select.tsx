import React, { useState, useRef, useEffect } from "react";
import FormGroup from "./FormGroup";
import { FiChevronDown } from "react-icons/fi";
import { SelectProps } from "@/types";

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
      <div ref={ref} className="relative  w-full">
        <button
          type="button"
          name={name}
          disabled={disabled}
          onClick={() => setOpen((prev) => !prev)}
          className={`w-full flex justify-between cursor-pointer items-center pt-4 pb-2 rounded-md text-sm ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-colors-var"
            }`}
        >
          <div className="w-full flex justify-between items-center px-1">
            <span className={value ? "font-semibold text-black" : "text-gray-400"}>
              {selectedLabel || ``}
            </span>
            <FiChevronDown
              className={`ml-2 h-4 w-4 transition-transform duration-150 ${open ? "rotate-180" : ""
                }`}
            />
          </div>
        </button>

        <ul
          className={`
            absolute left-0 z-12 top-10 mt-2 w-full
            bg-colors-var rounded-md shadow-sm
            max-h-60 overflow-y-auto text-sm
            transform origin-top transition-all duration-200 ease-out
            ${open
              ? 'opacity-100 scale-y-100'
              : 'opacity-0 scale-y-0 pointer-events-none'}
          `}
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              className={`px-3 py-2 cursor-pointer hover:bg-amber-800 hover:text-white ${opt.value === value ? 'bg-amber-800 text-white font-medium' : ''
                }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>

      </div>
    </FormGroup>
  );
};

export default Select;
