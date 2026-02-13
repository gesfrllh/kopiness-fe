interface CardFooterProps {
  children: React.ReactNode;
}

const CardFooter: React.FC<CardFooterProps> = ({ children }) => {
  return (
    <div className="mt-3 flex flex-col gap-3 pt-3 border-t border-gray-300">
      {children}
    </div>
  );
};

export default CardFooter;
