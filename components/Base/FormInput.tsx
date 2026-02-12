import React from 'react';
import { BaseInputProps } from '@/types';

const FormInput: React.FC<BaseInputProps> = ({
  value,
  onChange,
  type = 'text',
  placeholder = '',
  name,
  className = '',
  ...rest
}) => {
  // =====================
  // CHECKBOX MODE
  // =====================
  if (type === 'checkbox') {
    return (
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={Boolean(value)}
          onChange={onChange}
          className="hidden peer pt-4 pb-2"
          {...rest}
        />

        <div
          className="
            w-5 h-5
            border border-gray-500 peer-checked:border-amber-800
            rounded-md
            flex items-center justify-center
            peer-checked:bg-amber-800
          "
        >
          <span className="peer-checked:block text-white text-xs">
            ✓
          </span>
        </div>
      </label>
    );
  }

  // =====================
  // DEFAULT INPUT
  // =====================
  return (
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`outline-none bg-colors-var pt-4 pb-2 ${className}`}
      {...rest}
    />
  );
};

export default FormInput;
