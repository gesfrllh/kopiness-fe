"use client"

import { Icon } from '@iconify/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { UUIDTypes, v4 as uuid } from 'uuid'
import Image from 'next/image'
import Logo from '@/public/assets/logo.svg'
import { showNotify } from './notification/notify-controllers'
import { useRouter } from 'next/navigation'
import { formatError } from '@/utils/formatError'
import { useAuthStore } from '@/store/useAuthStore'
import { useResponsiveStore } from '@/store/useResponsiveStore'
import '../animation/AnimationCss.scss'

interface NavbarProps {
  link: string,
  title: string,
  id: UUIDTypes,
}

const Navbar = () => {
  const isMobile = useResponsiveStore((state) => state.isMobile)
  const [isActive, setIsActive] = useState<string>('')
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

  const logout = useAuthStore(state => state.logout)
  const route = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      showNotify({
        type: 'success',
        title: 'Sukses!',
        text: 'Anda telah berhasil keluar!',
      })
      route.push("/login")
    } catch (err) {
      showNotify({
        type: "error",
        title: 'Error!',
        text: `${formatError(err)}`
      })
    }
  }

  const isActiveLink = (data: string) => {
    return setIsActive(data)
  }

  return (
    <>
      <div className='border-b-2 fixed shadow-[4px_4px_0px_2px_#4E1F00] bg-white w-full p-8 flex items-center justify-between'>
        <div className='flex items-center gap-8'>
          <div className='h-0 relative -top-16'>
            <Image src={Logo} alt="" width={132} />
          </div>
        </div>
        {!isMobile ? (
          <div className="flex gap-8">
            {dataItem.map((item, idx) => (
              <div key={idx} onClick={() => isActiveLink(item.title)}>
                <Link href={item.link} className={`animatedText ${isActive === item.title ? 'active' : ''}`} >
                  {item.title.split('').map((char, i) => (
                    <span
                      key={i}
                      style={{
                        animationDelay: `${i * 50}ms`,
                        animationFillMode: 'forwards',
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </Link>
              </div>
            ))}
          </div>

        ) : (
          <div>
          </div>
        )}
        <div className='flex gap-8'>
          <div onClick={handleLogout} className='cursor-pointer'>
            <Icon icon="fa6-solid:circle-user" width={24} />
          </div>
          <div className='cursor-pointer'>
            <Icon icon="fa6-solid:cart-arrow-down" width={24} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
