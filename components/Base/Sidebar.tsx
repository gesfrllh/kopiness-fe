"use client"

import { Icon } from '@iconify/react'
import Link from 'next/link'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { v4 as uuid } from 'uuid'
import Image from 'next/image'
import Logo from '@/public/assets/logo.svg'
import { showNotify } from './notification/notify-controllers'
import { useRouter, usePathname } from 'next/navigation'
import { formatError } from '@/utils/formatError'
import { useAuthStore } from '@/store/useAuthStore'
import { useResponsiveStore } from '@/store/useResponsiveStore'
import { useSidebarStore } from '@/store/useSidebarStore'
import { useChatStore } from '@/store/useChatStore'
import '../animation/AnimationCss.scss'

const itemBase =
  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 relative'

const itemActive =
  'bg-[#BD6230] text-white shadow-[0_6px_18px_rgba(189,98,48,0.25)] font-medium'

const itemInactive = 'text-[#7F7E77] hover:bg-[rgba(189,98,48,0.08)] hover:translate-x-0.5'

const activeBar = 'before:absolute before:inset-y-1/2 before:-translate-y-1/2 before:left-0 before:w-[3px] before:h-5 before:bg-[#BD6230] before:rounded-r-full'

function isActiveLink(pathname: string, link: string) {
  return pathname === link || pathname.startsWith(link + '/')
}

const Sidebar = () => {
  const isMobile = useResponsiveStore(state => state.isMobile)
  const userData = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const router = useRouter()
  const pathname = usePathname()
  const collapsed = useSidebarStore(state => state.collapsed)
  const setCollapsed = useSidebarStore(state => state.setCollapsed)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const mobileOpen = useSidebarStore(state => state.mobileOpen)
  const closeMobile = useSidebarStore(state => state.closeMobile)
  const unreadChats = useChatStore((state) => state.chatList.reduce((total, chat) => total + chat.unreadCount, 0))

  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed')
    const isCollapsed = saved === 'true'
    setCollapsed(isCollapsed)
    document.documentElement.style.setProperty('--sidebar-width', isCollapsed ? '72px' : '260px')
  }, [setCollapsed])

  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', collapsed ? '72px' : '260px')
  }, [collapsed])

  const handleLogout = async () => {
    try {
      await logout()
      showNotify({ type: 'success', title: 'Sukses!', text: 'Anda telah berhasil keluar!' })
      router.push('/login')
    } catch (err) {
      showNotify({ type: 'error', title: 'Error!', text: formatError(err) })
    }
  }

  const isManagement = userData?.role === 'SUPERADMIN' || userData?.role === 'STOREOWNER'
  const isSuperAdmin = userData?.role === 'SUPERADMIN'
  const isCourier = userData?.role === 'COURIER'

  const filteredData = useMemo(() => {
    if (isCourier) {
      return [
        {
          id: uuid(),
          title: 'Tugas Pengantaran',
          link: '/manage/courier',
          icon: <Icon icon="mdi:truck-delivery-outline" width={20} />,
        },
        {
          id: uuid(),
          title: 'Profile',
          link: '/manage/profile',
          icon: <Icon icon="mdi:account-circle" width={20} />,
        },
      ]
    }

    if (!isManagement) {
      return [
        {
          id: uuid(),
          title: 'Home',
          link: '/manage/home',
          icon: <Icon icon="material-symbols-light:flood" width={20} />,
        },
        {
          id: uuid(),
          title: 'Stores',
          link: '/manage/stores',
          icon: <Icon icon="mdi:store" width={20} />,
        },
        {
          id: uuid(),
          title: 'Cart',
          link: '/manage/cart',
          icon: <Icon icon="mdi:cart" width={20} />,
        },
        {
          id: uuid(),
          title: 'History',
          link: '/manage/history',
          icon: <Icon icon="material-symbols-light:source-notes" width={20} />,
        },
      ]
    }

    const base = [
      {
        id: uuid(),
        title: 'Dashboard',
        link: '/manage/dashboard',
        icon: <Icon icon="material-symbols-light:dashboard-rounded" width={20} />
      },
      {
        id: uuid(),
        title: 'Kasir',
        link: '/manage/cashier',
        icon: <Icon icon="material-symbols-light:shopping-cart-sharp" width={20} />
      },
      {
        id: uuid(),
        title: 'Store',
        link: '/manage/stores',
        icon: <Icon icon="mdi:store-search" width={20} />
      },
      {
        id: uuid(),
        title: 'History',
        icon: <Icon icon="material-symbols-light:source-notes" width={20} />,
        children: [
          { id: uuid(), title: 'Payment History', link: '/manage/history' },
          { id: uuid(), title: 'Order Management', link: '/manage/order' }
        ]
      },
      {
        id: uuid(),
        title: 'Coffe Time',
        link: '/manage/coffee',
        icon: <Icon icon="material-symbols-light:coffee-maker" width={20} />
      },
      {
        id: uuid(),
        title: 'Profile',
        link: '/manage/profile',
        icon: <Icon icon="mdi:account-circle" width={20} />
      },
    ].map(item => {
      return item
    })

    if (isSuperAdmin) {
      base.splice(1, 0, {
        id: uuid(),
        title: 'Kelola Pengguna',
        link: '/manage/users',
        icon: <Icon icon="mdi:users-group" width={20} />
      })
    }
    if (isManagement) {
      base.unshift({
        id: uuid(),
        title: 'Home',
        link: '/manage/home',
        icon: <Icon icon="material-symbols-light:flood" width={20} />
      })
    }
    return base
  }, [isCourier, isManagement, isSuperAdmin])

  const otherItems = useMemo(() => {
    if (isCourier) {
      return [{ id: uuid(), title: 'Chat', link: '/manage/chat', icon: <Icon icon="mdi:chat-outline" width={20} /> }]
    }
    if (isManagement) {
      return [{ id: uuid(), title: 'Chat', link: '/manage/chat', icon: <Icon icon="mdi:chat-outline" width={20} /> }]
    }
    return []
  }, [isCourier, isManagement])

  const handleClickOutside = useCallback(() => setOpenDropdown(null), [])
  useEffect(() => {
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [handleClickOutside])

  const active = (link: string) => isActiveLink(pathname, link)
  const hasActiveChild = (children?: { link: string }[]) => children?.some(c => active(c.link))

  const avatarLetter = (userData?.name || userData?.role || 'U')[0]

  // ── Desktop ──────────────────────────────────────────────
  if (!isMobile) {
    return (
      <aside className={`app-sidebar fixed left-0 top-0 z-40 flex h-full flex-col transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[260px]'}`}>

        {/* Logo */}
        <div className="h-[60px] flex items-center gap-2 px-4 border-b border-[#DCD9D5] flex-shrink-0 overflow-hidden">
          <div className={`transition-all duration-300 flex-1 ${collapsed ? 'w-0 opacity-0 overflow-hidden' : 'opacity-100'}`}>
            <Image src={Logo} alt="" priority className="h-8 w-auto" />
          </div>
          {collapsed && (
            <div className="flex items-center justify-center flex-1">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#BD6230] to-[#8B4513] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                K
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          {!collapsed && (
            <p className="text-[#7F7E77] text-xs font-semibold uppercase tracking-widest mb-4 px-3">
              Menu
            </p>
          )}
          <div className="flex flex-col gap-[2px] items-stretch">
            {filteredData.map(item =>
              item.children ? (
                <div key={item.id} className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (collapsed) {
                        setOpenDropdown(openDropdown === item.title ? null : item.title)
                      } else {
                        setOpenDropdown(openDropdown === item.title ? null : item.title)
                      }
                    }}
                    className={`${itemBase} w-full justify-center md:justify-start ${hasActiveChild(item.children) ? `${itemActive} ${activeBar}` : itemInactive} ${collapsed ? 'px-0 justify-center' : ''}`}
                    title={collapsed ? item.title : undefined}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className={`${collapsed ? 'hidden' : ''}`}>{item.title}</span>
                    </div>
                    <Icon
                      icon="mdi:chevron-down"
                      width={16}
                      className={`transition-transform duration-200 ${collapsed ? 'hidden' : ''} ${openDropdown === item.title ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div className={`
                    ${collapsed
                      ? `fixed left-[72px] top-0 min-w-[200px] bg-[#FBFAF9] border border-[#DCD9D5] rounded-xl shadow-lg p-2 z-50 transition-all duration-200 ${openDropdown === item.title ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`
                      : `overflow-hidden transition-all duration-300 ease-in-out ${openDropdown === item.title ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`
                    }
                  `}>
                    <div className={`flex flex-col gap-[2px] ${collapsed ? '' : 'ml-4 pl-3 border-l-2 border-[#DCD9D5]'}`}>
                      {item.children.map(child => (
                        <Link
                          key={child.id}
                          href={child.link}
                          onClick={() => setOpenDropdown(null)}
                          className={`${itemBase} ${active(child.link) ? itemActive : itemInactive}`}
                        >
                          <span className="w-1 h-1 rounded-full bg-current opacity-40 flex-shrink-0" />
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.id}
                  href={item.link}
                  className={`${itemBase} ${active(item.link) ? `${itemActive} ${activeBar}` : itemInactive} ${collapsed ? 'px-0 justify-center' : ''}`}
                  title={collapsed ? item.title : undefined}
                >
                  {item.icon}
                  <span className={`${collapsed ? 'hidden' : ''}`}>{item.title}</span>
                  {item.title === 'Chat' && unreadChats > 0 && (
                    <span className={`${collapsed ? 'absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#E45B3A] ring-2 ring-[#FBFAF9]' : 'ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E45B3A] px-1 text-[10px] font-bold text-white'}`}>
                      {!collapsed && (unreadChats > 9 ? '9+' : unreadChats)}
                    </span>
                  )}
                </Link>
              )
            )}
          </div>

          {!collapsed && (
            <>
              <div className="my-6 mx-3 border-t border-[#DCD9D5]" />
              <p className="text-[#7F7E77] text-xs font-semibold uppercase tracking-widest mb-4 px-3">
                Other
              </p>
            </>
          )}
          {collapsed && <div className="my-4 mx-auto w-8 border-t border-[#DCD9D5]" />}
          <div className="flex flex-col gap-[2px] items-stretch">
            {otherItems.map(item => (
              <Link
                key={item.id}
                href={item.link}
                className={`${itemBase} ${active(item.link) ? `${itemActive} ${activeBar}` : itemInactive} ${collapsed ? 'px-0 justify-center' : ''}`}
                title={collapsed ? item.title : undefined}
              >
                {item.icon}
                <span className={`${collapsed ? 'hidden' : ''}`}>{item.title}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Profile */}
        <div className="px-3 py-4 border-t border-[#DCD9D5] flex-shrink-0">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#BD6230] to-[#8B4513] flex items-center justify-center text-white text-sm font-semibold shadow-sm flex-shrink-0">
              {avatarLetter}
            </div>
            <div className={`flex-1 min-w-0 transition-all duration-300 ${collapsed ? 'w-0 opacity-0 overflow-hidden' : 'opacity-100'}`}>
              <p className="text-sm font-medium text-[#2D2D2D] truncate">
                {userData?.name || 'User'}
              </p>
              <p className="text-xs text-[#7F7E77] truncate capitalize">
                {(userData?.role || 'guest').toLowerCase()}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className={`p-2 rounded-lg text-[#7F7E77] hover:bg-[rgba(189,98,48,0.08)] hover:text-[#BD6230] hover:scale-105 transition-all duration-200 flex-shrink-0 ${collapsed ? 'hidden' : ''}`}
              title="Logout"
            >
              <Icon icon="mdi:logout" width={18} />
            </button>
          </div>
        </div>
      </aside>
    )
  }

  // ── Mobile ───────────────────────────────────────────────
  return (
    <div className={`mobile-menu ${mobileOpen ? 'open' : 'close'}`}>
      {/* Mobile Logo */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#DCD9D5] mb-4">
        <Image src={Logo} alt="" priority className="h-7 w-auto" />
      </div>

      {filteredData.map(item => (
        <div key={item.id}>
          {item.children ? (
            <>
              <div
                className="flex justify-between items-center py-3 px-4 rounded-lg text-[#7F7E77]"
                onClick={(e) => {
                  e.stopPropagation()
                  setOpenDropdown(openDropdown === item.title ? null : item.title)
                }}
              >
                <div className="flex items-center gap-3 text-sm">
                  {item.icon}
                  <span>{item.title}</span>
                </div>
                <Icon
                  icon="mdi:chevron-down"
                  width={16}
                  className={`transition-transform duration-200 ${openDropdown === item.title ? 'rotate-180' : ''}`}
                />
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${openDropdown === item.title ? 'max-h-40' : 'max-h-0'}`}
              >
                <div className="ml-6 pl-3 border-l-2 border-[#DCD9D5] flex flex-col gap-[2px] pb-1">
                  {item.children.map(child => (
                    <Link
                      key={child.id}
                      href={child.link}
                      onClick={closeMobile}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${active(child.link) ? itemActive : 'text-[#7F7E77] hover:bg-[rgba(189,98,48,0.08)]'}`}
                    >
                      <span className="w-1 h-1 rounded-full bg-current opacity-40" />
                      {child.title}
                    </Link>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <Link
              href={item.link}
              onClick={closeMobile}
              className={`flex items-center gap-3 py-3 px-4 rounded-lg text-sm transition-all duration-200 ${active(item.link) ? itemActive : 'text-[#7F7E77] hover:bg-[rgba(189,98,48,0.08)]'}`}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          )}
        </div>
      ))}

      <div className="my-4 mx-4 border-t border-[#DCD9D5]" />

      <div className="px-4">
        {otherItems.map(item => (
          <Link
            key={item.id}
            href={item.link}
            onClick={closeMobile}
            className={`flex items-center gap-3 py-3 px-4 rounded-lg text-sm transition-all duration-200 ${active(item.link) ? itemActive : 'text-[#7F7E77] hover:bg-[rgba(189,98,48,0.08)]'}`}
          >
            {item.icon}
            <span>{item.title}</span>
            {item.title === 'Chat' && unreadChats > 0 && (
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E45B3A] px-1 text-[10px] font-bold text-white">
                {unreadChats > 9 ? '9+' : unreadChats}
              </span>
            )}
          </Link>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="mx-4 mt-4 w-[calc(100%-32px)] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#DCD9D5] text-[#7F7E77] text-sm hover:bg-[rgba(189,98,48,0.08)] hover:text-[#BD6230] transition-all duration-200"
      >
        <Icon icon="mdi:logout" width={18} />
        Logout
      </button>
    </div>
  )
}

export default Sidebar
