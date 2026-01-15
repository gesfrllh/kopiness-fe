import { CartItem, CartState } from '@/types/product'
import { create } from 'zustand'

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalQty: 0,

  addToCart: (product) => {
    const items = get().items
    const exist = items.find((i) => i.id === product.id)

    let newItems: CartItem[]

    if (exist) {
      newItems = items.map((i) =>
        i.id === product.id ? { ...i, qty: i.qty + 1 } : i
      )
    } else {
      newItems = [...items, { ...product, qty: 1 }]
    }

    set({
      items: newItems,
      totalQty: newItems.reduce((a, b) => a + b.qty, 0)
    })
  },

  removeFromCart: (id) => {
    const newItems = get().items.filter((i) => i.id !== id)

    set({
      items: newItems,
      totalQty: newItems.reduce((a, b) => a + b.qty, 0)
    })
  },

  clearCart: () => set({ items: [], totalQty: 0 })
}))