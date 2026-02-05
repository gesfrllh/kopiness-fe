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
import Button from './Button'

const Sidebar = () => {
  const isMobile = useResponsiveStore((state) => state.isMobile)
  const [isActive, setIsActive] = useState<string>('')
  const [userData, setUserData] = useState<{ role?: string } | null>(null);
  const logout = useAuthStore(state => state.logout)
  const route = useRouter()
  const [openMenu, setOpenMenu] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      link: '/manage/history',
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
    setUserData({ role: roleCookie });
  }, []);

  const filteredData = useMemo(() => {
    const base = dataItem.map(item => {
      if (userData?.role !== 'ADMIN' && item.title === 'Dashboard') {
        return {
          ...item,
          title: 'Home',
          link: '/manage/home',
          icon: <Icon icon="material-symbols-light:flood" width={24} />
        };
      }
      return item;
    });

    if (userData?.role === 'ADMIN') {
      base.unshift({
        id: uuid(),
        title: 'Home',
        link: '/manage/home',
        icon: <Icon icon="material-symbols-light:flood" width={24} />
      });
    }

    return base;
  }, [dataItem, userData]);

  const openMobileMenu = () => {
    setOpenMenu((prev) => !prev)
  }

  return (
    <>
      <div className='h-20 fixed w-full flex border-b border-amber-800 items-center justify-between px-12 md:px-32 bg-colors-var'>
        <div className='flex gap-8 items-center'>
          <Image src={Logo} alt="" priority width={132} />
        </div>
        <div className='flex items-center justify-center'>
          {!isMobile ? (
            <div className="flex gap-8 items-center">
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
              <Button variant='outline' onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <div>
              <Button variant='outline' onClick={openMobileMenu}>
                {openMenu ? 'Close Menu' : 'Open Menu'}
              </Button>
              <div className={`mobile-menu ${openMenu ? "open" : "close"}`}>
                {filteredData.map((item, idx) => (
                  <div key={idx} onClick={() => isActiveLink(item.title)}>
                    <Link href={item.link} onClick={openMobileMenu} className="flex py-4 gap-4 hover:bg-amber-800 hover:text-white px-4 rounded-lg">
                      <div>{item.icon}</div>
                      <div>{item.title}</div>
                    </Link>
                  </div>
                ))}

                <Button variant="outline" className="w-full mt-4" onClick={() => handleLogout()}>
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Sidebar