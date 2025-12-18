import Image from 'next/image';

interface CardImageProps {
  src: string;
  alt?: string;
}

const CardImage: React.FC<CardImageProps> = ({ src, alt = '' }) => {
  return (
    <div className="flex justify-center">
      <div className="relative size-[140px] md:size-[240px]">
        <Image
          src={src}
          alt={alt}
          fill
          className="rounded object-cover"
        />
      </div>
    </div>
  );
};

export default CardImage;