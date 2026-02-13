import Image from 'next/image';

interface CardImageProps {
  src?: string[] | string;
  alt?: string;
}

const CardImage: React.FC<CardImageProps> = ({ src, alt = '' }) => {
  return (
    <div className="relative w-full h-64 overflow-hidden">
      <Image
        src={src as string}
        alt={alt}
        fill
        className="
          object-cover
          transition-transform duration-500
          group-hover:scale-110
        "
      />
    </div>
  );
};

export default CardImage;