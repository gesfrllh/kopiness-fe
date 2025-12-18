interface CardContentProps {
  children: React.ReactNode;
}

const CardContent: React.FC<CardContentProps> = ({ children }) => {
  return <div className="flex flex-col gap-2">{children}</div>;
};

export default CardContent;
