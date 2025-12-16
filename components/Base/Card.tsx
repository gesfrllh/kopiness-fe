import React from 'react'
import Image from 'next/image'
import { formatCurrency } from '@/utils/general'
import Button from './Button'
import { CardProps } from '@/types'

const Card: React.FC<CardProps> = ({ id, title, desc, image, price, sec_title, onAddToCart, onDetail }) => {
  return (
    <>
      <div className=" flex flex-col gap-8 bg-white p-4 shadow-[8px_6px_0px_1px_#422900] border rounded-lg" >
        <div className='flex items-center justify-center'>
          <div className="relative size-[140px] md:w-[240px] md:h-[240px]">
            <Image
              src={image}
              alt=""
              fill
              style={{ objectFit: "cover" }}
              className="rounded"
            />
          </div>
        </div>

        <div className="flex flex-col w-[15rem] md:w-72 gap-2">
          <span className="font-semibold text-xl">{title}</span>
          <span className='font-semibold h-12'>{sec_title}</span>
          <div className='text-right'>
            <span className="font-bold text-green-600">{formatCurrency(price)}</span>
            <Button
              type="submit"
              onClick={onAddToCart}
              className='w-full mt-8'>
              Keranjang
            </Button>
          </div>
          <div>
            <Button
              type="submit"
              onClick={() => onDetail(id)}
              className='w-full'>
              Detail
            </Button>
          </div>
        </div>
      </div>
    </>

  )
}

export default Card
