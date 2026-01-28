import { CartItem, CartState } from '@/types/product'
import { create } from 'zustand'

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalQty: 0,

  addToCart: (product) => {
    const items = get().items
    const exist = items.some((i) => i.id === product.id)

    if (exist) return

    const newItems: CartItem[] = [...items, { ...product, qty: 1 }]

    set({
      items: newItems,
      totalQty: newItems.length
    })
  },

  removeFromCart: (ids) => {
    const list = Array.isArray(ids) ? ids : [ids]

    set({
      items: get().items.filter(i => !list.includes(i.id as string)),
      totalQty: get().items.length - list.length
    })
  },

  clearCart: () => set({ items: [], totalQty: 0 })
}))
