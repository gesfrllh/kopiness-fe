import { Icon } from '@iconify/react'
import Link from 'next/link'
import React from 'react'
import { UUIDTypes, v4 as uuid } from 'uuid'
import Image from 'next/image'
import Logo from '@/public/assets/logo.svg'

interface NavbarProps {
  link: string,
  title: string,
  id: UUIDTypes,
}

const Navbar = () => {
  const dataItem: NavbarProps[] = [
    {
      id: uuid(),
      title: 'Dashboard',
      link: '/manage/dashboard',
    },
    {
      id: uuid(),
      title: 'Kasir',
      link: '/manage/cashier',
    },
    {
      id: uuid(),
      title: 'Produk',
      link: '/manage/product',
    },
    {
      id: uuid(),
      title: 'Catatan',
      link: '/manage/logs',
    },
    {
      id: uuid(),
      title: 'Kalkulator Brew',
      link: '/manage/calculate',
    },
  ]

  return (
    <>
      <div className='border-b-2 border-amber-800 shadow-lg p-4 flex items-center justify-between'>
        <div className='flex items-center gap-8'>
          <Icon icon="fa6-solid:circle-user" />
          <div className='border-2 h-0 relative -top-8'>
          <Image src={Logo} alt="" width={72} />
          </div>
        </div>
        <div className='flex gap-8 border-2'>
          {dataItem.map((item, idx) => (
            <div key={idx}>
              <Link href={item.link}>{item.title}</Link>
            </div>
          ))}
        </div>
        <div className='cursor-pointer'>
          <Icon icon="fa6-solid:cart-arrow-down" />
        </div>
      </div>
    </>
  )
}

export default Navbar
