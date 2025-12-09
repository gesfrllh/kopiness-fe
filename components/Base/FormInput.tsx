import React from 'react';
import { BaseInputProps } from '@/types';

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
      type={type  }
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full outline-none bg-white ${className}`}
      {...rest}
    />
  );
};

export default FormInput;
