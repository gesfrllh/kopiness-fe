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
    border border-amber-700
    p-6
    shadow-[8px_8px_0px_0px_#5C2E00]
    transition-all duration-300
    hover:translate-x-1
    hover:translate-y-1
    `,
        className
      )}
    >

      {children}
    </div>
  );
};

export default CardRoot;
