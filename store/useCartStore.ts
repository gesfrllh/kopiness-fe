import { CartItem, CartState } from '@/types/product'
import { create } from 'zustand'
import { addCartItem, removeCartItem, clearCartApi, getCart } from '@/lib/api/cart'
import { showNotify } from '@/components/Base/notification/notify-controllers'
import { formatError } from '@/utils/formatError'

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalQty: 0,

  addToCart: async (product) => {
    const items = get().items
    const exist = items.some((i) => i.id === product.id)

    if (exist) return

    try {
      await addCartItem(product.id as string, 1)
    } catch {
      // fallback: local only
    }

    const newItems: CartItem[] = [...items, { ...product, qty: 1 }]
    set({ items: newItems, totalQty: newItems.length })
  },

  removeFromCart: (ids) => {
    const list = Array.isArray(ids) ? ids : [ids]

    list.forEach((id) => {
      removeCartItem(id).catch(() => {
        // fallback: local only
      })
    })

    set({
      items: get().items.filter(i => !list.includes(i.id as string)),
      totalQty: get().items.length - list.length
    })
  },

  clearCart: () => {
    clearCartApi().catch(() => {
      // fallback: local only
    })
    set({ items: [], totalQty: 0 })
  },

    fetchCart: async () => {
    try {
      const res = await getCart()
      const items: CartItem[] = (res?.items ?? []).map((item) => ({
        id: item.productId,
        name: item.productName,
        imageUrl: item.productImage ? [item.productImage] : [],
        price: item.price,
        stock: item.stock,
        origin: '',
        process: '',
        flavorNotes: '',
        roastLevel: 'MEDIUM',
        secTitle: '',
        description: '',
        qty: item.quantity,
      }))
      set({ items, totalQty: items.length })
    } catch {
      // keep local state
    }
  },
}))
