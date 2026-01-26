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
          className="hidden peer"
          {...rest}
        />

        <div
          className="
            w-5 h-5
            border-2 border-amber-800
            rounded-md
            flex items-center justify-center
            peer-checked:bg-amber-800
          "
        >
          <span className="hidden peer-checked:block text-white text-xs">
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
      className={`outline-none bg-white ${className}`}
      {...rest}
    />
  );
};

export default FormInput;
