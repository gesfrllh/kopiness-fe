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
        'flex flex-col gap-6 bg-white p-4 shadow-[8px_6px_0px_1px_#422900] border rounded-lg',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default CardRoot;
