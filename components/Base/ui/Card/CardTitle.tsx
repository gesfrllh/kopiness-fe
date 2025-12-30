interface CardTitleProps {
  title?: string;
  subtitle?: string | number;
}

const CardTitle: React.FC<CardTitleProps> = ({ title, subtitle }) => {
  return (
    <>
      <span className="font-semibold text-xl">{title}</span>
      {subtitle && (
        <span className="font-semibold text-sm text-gray-600">
          {subtitle}
        </span>
      )}
    </>
  );
};

export default CardTitle;
