import React from 'react';
import clsx from 'clsx';
import { ButtonProps } from '@/types';

const Button: React.FC<ButtonProps> = ({
  variant = 'outline',
  disabled = false,
  children,
  className,
  ...props
}) => {
  return (
    <button
      disabled={disabled}
      className={clsx(
        'px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer',

        {
          'bg-primary text-white hover:brightness-95':
            variant === 'solid' && !disabled,

          'border border-primary text-primary bg-transparent hover:bg-primary hover:text-white':
            variant === 'outline' && !disabled,

          'opacity-50 cursor-not-allowed':
            disabled,
        },

        // Override dari parent selalu di akhir
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;