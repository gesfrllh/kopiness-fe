import React from 'react'
import Image from 'next/image'
import { formatCurrency } from '@/utils/general'
import Button from './Button'

interface CardProps {
  id: number,
  title: string,
  sec_title: string,
  desc: string,
  image: string,
  width: number,
  height: number,
  price: number,
  onAddToCart?: () => void,
  onDetail: (id: number) => void
}

const Card: React.FC<CardProps> = ({ id, title, desc, image, price, sec_title, onAddToCart, onDetail }) => {
  return (
    <>
      <div className=" flex gap-8 bg-white p-4 shadow-[8px_6px_0px_1px_#422900] border rounded-lg" >
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
          <span className="font-semibold text-xl text-center">{title}</span>
          <span className='font-semibold'>{sec_title}</span>
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
