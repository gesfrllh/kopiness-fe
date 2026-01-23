import Image from 'next/image';

interface CardImageProps {
  src?: string[] | string;
  alt?: string;
}

const CardImage: React.FC<CardImageProps> = ({ src, alt = '' }) => {
  return (
    <div className="flex justify-center">
      <div className="relative size-[140px] md:size-[240px]">
        <Image
          src={src as string}
          sizes="(max-width: 768px) 100vw, 33vw"
          alt={alt}
          fill
          priority
          className="rounded object-cover"
        />
      </div>
    </div>
  );
};

export default CardImage;