"use client"

import { Icon } from '@iconify/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { searchProducts } from '@/lib/api/productApi'
import { getStores } from '@/lib/api/stores'
import { ProductResponse } from '@/types/product'
import { Store } from '@/types/store'
import { useChatStore } from '@/store/useChatStore'
import { useTheme } from '@/context/theme-context'
import { formatDate } from '@/utils/general'
import { useSidebarStore } from '@/store/useSidebarStore'

/* ── Route config ──────────────────────────────── */
interface SearchRoute {
  id: string
  title: string
  path: string
  icon: string
  category: string
}

const allRoutes: SearchRoute[] = [
  { id: 'home', title: 'Home', path: '/manage/home', icon: 'material-symbols-light:flood', category: 'Menu' },
  { id: 'dashboard', title: 'Dashboard', path: '/manage/dashboard', icon: 'material-symbols-light:dashboard-rounded', category: 'Menu' },
  { id: 'kasir', title: 'Kasir', path: '/manage/cashier', icon: 'material-symbols-light:shopping-cart-sharp', category: 'Menu' },
  { id: 'stores', title: 'Store', path: '/manage/stores', icon: 'mdi:store-search', category: 'Menu' },
  { id: 'history', title: 'Payment History', path: '/manage/history', icon: 'material-symbols-light:source-notes', category: 'Menu' },
  { id: 'order', title: 'Order Management', path: '/manage/order', icon: 'material-symbols-light:receipt-long', category: 'Menu' },
  { id: 'coffee', title: 'Coffe Time', path: '/manage/coffee', icon: 'material-symbols-light:coffee-maker', category: 'Menu' },
  { id: 'profile', title: 'Profile', path: '/manage/profile', icon: 'mdi:account-circle', category: 'Other' },
  { id: 'chat', title: 'Chat', path: '/manage/chat', icon: 'mdi:chat-outline', category: 'Other' },
  { id: 'cart', title: 'Cart', path: '/manage/cart', icon: 'mdi:cart', category: 'Other' },
]

interface SearchResult {
  id: string
  title: string
  subtitle?: string
  path: string
  icon: string | React.ReactNode
  category: string
}

const Navbar = () => {
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [loading, setLoading] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const notifications = useChatStore((state) => state.notifications)
  const clearNotifications = useChatStore((state) => state.clearNotifications)
  const mobileOpen = useSidebarStore((state) => state.mobileOpen)
  const toggleMobile = useSidebarStore((state) => state.toggleMobile)
  const inputRef = useRef<HTMLInputElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  const closeSearchOnOutside = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('[data-search-modal]') && !target.closest('[data-search-trigger]')) {
      setSearchOpen(false)
      setSearchQuery('')
    }
  }, [])

  const closeNotifOnOutside = useCallback((e: MouseEvent) => {
    if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
      setNotifOpen(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('click', closeSearchOnOutside)
    document.addEventListener('click', closeNotifOnOutside)
    return () => {
      document.removeEventListener('click', closeSearchOnOutside)
      document.removeEventListener('click', closeNotifOnOutside)
    }
  }, [closeSearchOnOutside, closeNotifOnOutside])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(prev => !prev)
        setSearchQuery('')
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setSearchQuery('')
        setNotifOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [searchOpen])

  useEffect(() => {
    setSelectedIdx(0)
  }, [searchQuery])

  /* ── debounced search ── */
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase()

    /* route filter */
    const routeResults: SearchResult[] = allRoutes
      .filter(r => r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q))
      .map(r => ({ ...r, icon: <Icon icon={r.icon} width={18} /> }))

    if (!q) {
      setSearchResults(routeResults)
      setLoading(false)
      return
    }

    setLoading(true)
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      let apiResults: SearchResult[] = []

      try {
        const [prodRes, storeRes] = await Promise.allSettled([
          searchProducts(q),
          getStores(),
        ])

        if (prodRes.status === 'fulfilled') {
          const data = prodRes.value?.data ?? prodRes.value ?? []
          apiResults = [
            ...(Array.isArray(data) ? data : []).map((p: ProductResponse) => ({
              id: `product-${p.id}`,
              title: p.name,
              subtitle: p.price ? `Rp ${p.price.toLocaleString('id-ID')}` : undefined,
              path: `/manage/product/edit/${p.store_id ?? ''}/${p.id}`,
              icon: <Icon icon="material-symbols-light:coffee-maker-outline" width={18} />,
              category: 'Products',
            })),
          ]
        }

        if (storeRes.status === 'fulfilled') {
          const data = storeRes.value?.data ?? storeRes.value ?? []
          apiResults = [
            ...apiResults,
            ...(Array.isArray(data) ? data : []).filter((s: Store) =>
              s.name?.toLowerCase().includes(q)
            ).map((s: Store) => ({
              id: `store-${s.id}`,
              title: s.name,
              subtitle: s.address,
              path: `/manage/stores/${s.slug}`,
              icon: <Icon icon="mdi:store" width={18} />,
              category: 'Stores',
            })),
          ]
        }
      } catch { /* ignore */ }

      setSearchResults([...routeResults, ...apiResults])
      setLoading(false)
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchQuery])

  const navigate = useCallback((path: string) => {
    setSearchOpen(false)
    setSearchQuery('')
    router.push(path)
  }, [router])

  /* ── keyboard nav ── */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIdx(prev => Math.min(prev + 1, searchResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIdx(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && searchResults[selectedIdx]) {
      navigate(searchResults[selectedIdx].path)
    }
  }

  /* ── grouped display ── */
  const grouped = useMemo(() => {
    const map = new Map<string, SearchResult[]>()
    searchResults.forEach(r => {
      const arr = map.get(r.category) ?? []
      arr.push(r)
      map.set(r.category, arr)
    })
    return Array.from(map.entries())
  }, [searchResults])

  return (
    <>
      {/* ── Navbar ── */}
      <header className="app-topbar sticky top-0 z-40 h-16 flex items-center gap-2 px-3 sm:gap-3 sm:px-6">
        <button
          onClick={toggleMobile}
          className="app-icon-button flex md:hidden"
          aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          aria-expanded={mobileOpen}
        >
          <Icon icon={mobileOpen ? 'mdi:close' : 'mdi:menu'} width={23} />
        </button>

        {/* Search button */}
        <button
          data-search-trigger
          onClick={() => setSearchOpen(true)}
          className="app-search flex w-full max-w-md items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all duration-200 sm:px-4"
        >
          <Icon icon="mdi:magnify" width={18} />
          <span className="flex-1 text-left">Cari menu, produk, store...</span>
          <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border border-[#DCD9D5] text-[10px] font-medium text-[#7F7E77]">
            <Icon icon="mdi:apple-keyboard-command" width={12} />K
          </kbd>
        </button>

        <button
          onClick={toggleTheme}
          className="app-icon-button flex"
          aria-label={theme === 'light' ? 'Aktifkan dark mode' : 'Aktifkan light mode'}
        >
          <Icon icon={theme === 'light' ? 'mdi:weather-night' : 'mdi:white-balance-sunny'} width={20} />
        </button>

        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(prev => !prev)}
            className="app-icon-button relative flex"
          >
            <Icon icon="mdi:bell-outline" width={22} />
            {notifications.length > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#E45B3A] ring-2 ring-[var(--surface)]" />
            )}
          </button>

          {notifOpen && (
            <div className="app-notification-panel absolute right-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl shadow-lg">
              <div className="flex items-center justify-between px-4 py-3">
                <p className="text-sm font-semibold">Notifikasi</p>
                {notifications.length > 0 && <button onClick={clearNotifications} className="text-xs font-medium text-[#BD6230] hover:underline">Bersihkan</button>}
              </div>
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-[var(--muted)]">
                  <Icon icon="mdi:bell-off-outline" width={32} className="opacity-40 mb-2" />
                  <p className="text-sm">Belum ada notifikasi</p>
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <button key={n.id} onClick={() => navigate('/manage/chat')} className="block w-full border-t border-[var(--line)] px-4 py-3 text-left transition-colors hover:bg-[var(--surface-muted)]">
                      <p className="text-sm font-semibold text-[var(--ink)]">Pesan baru dari {n.senderName}</p>
                      <p className="mt-0.5 truncate text-xs text-[var(--muted)]">{n.content}</p>
                      <p className="mt-1 text-[10px] text-[var(--muted)]">{formatDate(n.createdAt, 'time')}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ── Search Modal ── */}
      {searchOpen && (
        <div
          data-search-modal
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-[#FBFAF9] border border-[#DCD9D5] rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
            {/* input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#DCD9D5]">
              <Icon icon="mdi:magnify" width={20} className="text-[#7F7E77] flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search pages, products, stores..."
                className="flex-1 bg-transparent text-sm text-[#2D2D2D] outline-none placeholder:text-[#7F7E77]/60"
              />
              {loading && <Icon icon="mdi:loading" width={18} className="animate-spin text-[#BD6230]" />}
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                className="p-1 rounded-md text-[#7F7E77] hover:bg-[rgba(189,98,48,0.08)] transition-colors"
              >
                <Icon icon="mdi:close" width={16} />
              </button>
            </div>

            {/* results */}
            <div className="max-h-80 overflow-y-auto p-2">
              {grouped.length === 0 && !loading && (
                <div className="flex flex-col items-center py-8 text-[#7F7E77]">
                  <Icon icon="mdi:search-off" width={32} className="opacity-40 mb-2" />
                  <p className="text-sm">No results found</p>
                </div>
              )}
              {grouped.map(([category, items], gi) => {
                let globalIdx = 0
                for (let i = 0; i < gi; i++) {
                  globalIdx += grouped[i][1].length
                }
                return (
                  <div key={category}>
                    <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-[#7F7E77]">
                      {category}
                    </p>
                    {items.map((item, ii) => {
                      const idx = globalIdx + ii
                      return (
                        <button
                          key={item.id}
                          onClick={() => navigate(item.path)}
                          onMouseEnter={() => setSelectedIdx(idx)}
                          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-left transition-all duration-150 ${idx === selectedIdx ? 'bg-[#BD6230] text-white shadow-[0_4px_12px_rgba(189,98,48,0.2)]' : 'text-[#2D2D2D] hover:bg-[rgba(189,98,48,0.06)]'}`}
                        >
                          <span className="flex-shrink-0 opacity-60">{item.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`truncate ${idx === selectedIdx ? 'font-medium' : ''}`}>{item.title}</p>
                            {item.subtitle && (
                              <p className={`text-xs truncate ${idx === selectedIdx ? 'text-white/70' : 'text-[#7F7E77]'}`}>{item.subtitle}</p>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>

            {/* footer hint */}
            <div className="px-4 py-2.5 border-t border-[#DCD9D5] flex items-center gap-4 text-[10px] text-[#7F7E77]">
              <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-[#F1ECE7]">↑↓</kbd> Navigate</span>
              <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-[#F1ECE7]">↵</kbd> Open</span>
              <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-[#F1ECE7]">Esc</kbd> Close</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
