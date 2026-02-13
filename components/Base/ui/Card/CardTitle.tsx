interface CardTitleProps {
  title?: string;
  subtitle?: string | number;
}

const CardTitle: React.FC<CardTitleProps> = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col">
      <span className="font-semibold text-lg tracking-tight text-gray-800">
        {title}
      </span>
      {subtitle && (
        <span className="text-sm text-gray-500">
          {subtitle}
        </span>
      )}
    </div>
  );
};

export default CardTitle;
