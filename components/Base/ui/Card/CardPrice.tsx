import clsx from 'clsx';
import { formatCurrency } from '@/utils/general';

interface CardPriceProps {
  value: number;
  className?: string;
}

const CardPrice: React.FC<CardPriceProps> = ({ value, className }) => {
  return (
    <span
      className={clsx('font-bold text-green-600 text-right', className)}
    >
      {formatCurrency(value)}
    </span>
  );
};

export default CardPrice;
