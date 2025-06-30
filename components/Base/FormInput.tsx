import React from 'react';

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}

const FormInput: React.FC<BaseInputProps> = ({
  value,
  onChange,
  type = 'text',
  placeholder = '',
  name,
  className,
  ...rest
}) => {
  return (
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full outline-none bg-transparent ${className}`}
      {...rest}
    />
  );
};

export default FormInput;
