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
import Button from './Button'

const Sidebar = () => {
  const isMobile = useResponsiveStore((state) => state.isMobile)
  const [userData, setUserData] = useState<{ role?: string } | null>(null)
  const logout = useAuthStore(state => state.logout)
  const route = useRouter()
  const [openMenu, setOpenMenu] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const dataItem = [
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
      title: 'History',
      icon: <Icon icon="material-symbols-light:source-notes" width={24} />,
      children: [
        {
          id: uuid(),
          title: 'Payment History',
          link: '/manage/history'
        },
        {
          id: uuid(),
          title: 'Order Management',
          link: '/manage/order'
        }
      ]
    },
    {
      id: uuid(),
      title: 'Coffe Time',
      link: '/manage/coffee',
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

  useEffect(() => {
    const roleCookie = Cookies.get('role')
    setUserData({ role: roleCookie })
  }, [])

  const filteredData = useMemo(() => {
    const base = dataItem.map(item => {
      if (userData?.role !== 'ADMIN' && item.title === 'Dashboard') {
        return {
          ...item,
          title: 'Home',
          link: '/manage/home',
          icon: <Icon icon="material-symbols-light:flood" width={24} />
        }
      }
      return item
    })

    if (userData?.role === 'ADMIN') {
      base.unshift({
        id: uuid(),
        title: 'Home',
        link: '/manage/home',
        icon: <Icon icon="material-symbols-light:flood" width={24} />
      })
    }

    return base
  }, [userData])

  const openMobileMenu = () => {
    setOpenMenu(prev => !prev)
  }

  // close dropdown klik luar
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null)
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className='h-20 fixed w-full flex items-center justify-between px-12 md:px-32 theme-card border-b'>

      {/* LOGO */}
      <div className='flex gap-8 items-center'>
        <Image src={Logo} alt="" priority width={132} />
      </div>

      {/* MENU */}
      <div className='flex items-center'>
        {!isMobile ? (
          <div className="flex gap-8 items-center">

            {filteredData.map((item, idx) => (
              <div key={idx} className="relative">

                {/* PARENT */}
                {item.children ? (
                  <div
                    className="flex gap-2 items-center cursor-pointer theme-text hover:text-primary"
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpenDropdown(openDropdown === item.title ? null : item.title)
                    }}
                  >
                    {item.icon}
                    {item.title}
                    <Icon
                      icon="mdi:chevron-down"
                      width={18}
                      className={`transition-transform duration-200 ${openDropdown === item.title ? 'rotate-180' : ''}`}
                    />
                  </div>
                ) : (
                  <Link
                    href={item.link}
                    className="flex gap-2 items-center theme-text hover:text-primary"
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                )}

                {/* DROPDOWN (SMOOTH ANIMATION) */}
                {item.children && (
                  <div
                    className={`
                      absolute top-10 left-0 z-50 min-w-[200px]
                      bg-white rounded-lg shadow-lg p-2
                      transform origin-top transition-all duration-300 ease-out
                      ${openDropdown === item.title
                        ? "opacity-100 scale-y-100 translate-y-0"
                        : "opacity-0 scale-y-0 -translate-y-2 pointer-events-none"}
                    `}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.children.map((child, i) => (
                      <Link
                        key={i}
                        href={child.link}
                        className="block px-4 py-2 rounded-md hover:bg-gray-100 transition-all duration-150"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}

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
                <div key={idx}>

                  {item.children ? (
                    <>
                      <div
                        className="flex justify-between items-center py-4 px-4"
                        onClick={() =>
                          setOpenDropdown(openDropdown === item.title ? null : item.title)
                        }
                      >
                        <div className="flex gap-4">
                          {item.icon}
                          {item.title}
                        </div>
                        <Icon
                          icon="mdi:chevron-down"
                          width={18}
                          className={`transition-transform duration-200 ${openDropdown === item.title ? 'rotate-180' : ''}`}
                        />
                      </div>

                      <div
                        className={`
                          overflow-hidden transition-all duration-300
                          ${openDropdown === item.title ? 'max-h-40' : 'max-h-0'}
                        `}
                      >
                        {item.children.map((child, i) => (
                          <Link
                            key={i}
                            href={child.link}
                            onClick={openMobileMenu}
                            className="block pl-12 py-2 hover:bg-primary hover:text-white"
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.link}
                      onClick={openMobileMenu}
                      className="flex py-4 gap-4 hover:bg-primary hover:text-white px-4 rounded-lg"
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  )}

                </div>
              ))}

              <Button variant="outline" className="w-full mt-4" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar