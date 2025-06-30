import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline';
}

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
        'px-4 py-2 rounded-lg font-medium transition-colors',
        {
          'bg-amber-800 text-white hover:bg-amber-700': variant === 'solid' && !disabled,
          'border border-amber-800 text-amber-800 hover:bg-amber-800 hover:text-white': variant === 'outline' && !disabled,
          'opacity-50 cursor-not-allowed bg-gray-600': disabled,
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
