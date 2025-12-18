interface CardFooterProps {
  children: React.ReactNode;
}

const CardFooter: React.FC<CardFooterProps> = ({ children }) => {
  return <div className="mt-4 flex flex-col gap-2">{children}</div>;
};

export default CardFooter;
