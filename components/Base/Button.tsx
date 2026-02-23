import React from 'react';
import clsx from 'clsx';
import { ButtonProps } from '@/types';

const Button: React.FC<ButtonProps> = ({
  variant = 'solid',
  disabled = false,
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer',
        {
          'btn-solid': variant === 'solid' && !disabled,
          'btn-outline': variant === 'outline' && !disabled,
          'opacity-50 cursor-not-allowed': disabled,
        },
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
