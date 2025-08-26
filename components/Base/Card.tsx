import React from 'react'
import Image from 'next/image'
import { formatCurrency } from '@/utils/general'
import Button from './Button'

interface CardProps {
    title: string,
    desc: string,
    image: string,
    width: number,
    height: number,
    price: number
}

const Card: React.FC<CardProps> = ({title, desc, image, price}) => {
  return (
    <>
      <div className=" flex  gap-8 bg-white p-4 shadow-[8px_6px_0px_1px_#422900] border rounded-lg">
        <div className="relative w-[240px] h-[240px]">
          <Image
            src={image}
            alt=""
            fill
            style={{ objectFit: "cover" }}
            className="rounded"
          />
        </div>

        <div className="flex flex-col w-72 gap-4">
          <span className="font-semibold text-center">{title}</span>
          <span className="text-sm text-gray-600 text-justify">{desc}</span>
          <div className='text-right'>
            <span className="font-bold text-green-600">{formatCurrency(price)}</span>
              <Button
            type="submit"
            className='w-full mt-8'>
              Keranjang
          </Button>
          </div>
        </div>
      </div>
    </>

  )
}

export default Card
