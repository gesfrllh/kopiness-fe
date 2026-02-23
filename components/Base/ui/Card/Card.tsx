import React from 'react';
import clsx from 'clsx';

interface CardRootProps {
  children: React.ReactNode;
  className?: string;
}

const CardRoot: React.FC<CardRootProps> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        `
    relative
    bg-white
    rounded-2xl
    border-var
    p-6
    transition-all duration-300
    hover:translate-x-1
    hover:translate-y-1
    `,
        'card-shadow',
        className
      )}
    >

      {children}
    </div>
  );
};

export default CardRoot;
