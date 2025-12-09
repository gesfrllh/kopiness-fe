"use client"

import { Icon } from '@iconify/react'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'
import Image from 'next/image'
import Logo from '@/public/assets/logo.svg'
import Cookies from 'js-cookie'
import { showNotify } from './notification/notify-controllers'
import { useRouter } from 'next/navigation'
import { formatError } from '@/utils/formatError'
import { useAuthStore } from '@/store/useAuthStore'
import { useResponsiveStore } from '@/store/useResponsiveStore'
import '../animation/AnimationCss.scss'
import { NavbarProps } from '@/types'

const Sidebar = () => {
  const isMobile = useResponsiveStore((state) => state.isMobile)
  const [isActive, setIsActive] = useState<string>('')
  const [userData, setUserData] = useState<{ role?: string } | null>(null);
   
  const dataItem: NavbarProps[] = [
    {
      id: uuid(),
      title: 'Dashboard',
      link: '/manage/dashboard',
      icon: <Icon icon="material-symbols-light:dashboard-rounded" width={24} />
    },
    {
      id: uuid(),
      title: 'Kasir',
      link: '/manage/cashier',
      icon: <Icon icon="material-symbols-light:shopping-cart-sharp" width={24} />

    },
    {
      id: uuid(),
      title: 'Produk',
      link: '/manage/product',
      icon: <Icon icon="material-symbols-light:desktop-landscape-add" width={24} />
    },
    {
      id: uuid(),
      title: 'Catatan',
      link: '/manage/logs',
      icon: <Icon icon="material-symbols-light:source-notes" width={24} />
    },
    {
      id: uuid(),
      title: 'Kalkulator Brew',
      link: '/manage/calculate',
      icon: <Icon icon="material-symbols-light:coffee-maker" width={24} />
    },
    {
      id: uuid(),
      title: 'Profile',
      link: '/manage/profile',
      icon: <Icon icon="mdi:account-circle" width={24} />
    },
  ]

  const logout = useAuthStore(state => state.logout)
  const loading = useAuthStore(state => state.loading)
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

  useEffect(() => {
    const roleCookie = Cookies.get('role');
    setUserData({ role: roleCookie});
  }, []);

  const filteredData = useMemo(() => {
    return dataItem.map(item => {
      if (userData?.role !== 'ADMIN' && item.title === 'Dashboard') {
        return {
          ...item,
          title: 'Home',
          link: '/manage/home',
          icon: <Icon icon="mdi:account-circle" width={24} />
        }
      }
      return item;
    })
  }, [userData]);

  return (
    <>
      <div className='h-20 fixed w-full flex items-center justify-between px-32 bg-white'>
        <div className='flex gap-8 items-center'>
          <Image src={Logo} alt="" width={132} />
        </div>
        <div className='flex'>
          {!isMobile ? (
            <div className="flex gap-8">
              {filteredData.map((item, idx) => (
                <div key={idx} onClick={() => isActiveLink(item.title)}>
                  <Link href={item.link} className="flex gap-4">
                    <div>
                      {item.icon}
                    </div>
                    <div>
                      {item.title}
                    </div>
                  </Link>
                </div>
              ))}
              <div onClick={() => handleLogout()}>
                <p>Logout</p>
              </div>
            </div>

          ) : (
            <div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Sidebar