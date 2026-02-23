import React, { useEffect, useRef, useState } from 'react';
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
  // DEBOUNCE LOGIC (default input only, 500ms)
  // =====================
  const [internalValue, setInternalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleDebouncedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange?.(e);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

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
          className={
            `w-5 h-5 rounded-md flex items-center justify-center theme-border peer-checked:bg-primary peer-checked:text-white`
          }
        >
          <span className="hidden peer-checked:block text-white text-xs">✓</span>
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
      value={internalValue}
      onChange={handleDebouncedChange}
      placeholder={placeholder}
      className={`outline-none bg-colors-var p-2 theme-text rounded ${className}`}
      {...rest}
    />
  );
};

export default FormInput;