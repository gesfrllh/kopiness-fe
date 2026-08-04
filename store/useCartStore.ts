import { CartItem, CartState } from '@/types/product'
import { create } from 'zustand'
import { addCartItem, removeCartItem, clearCartApi, getCart, updateCartItem } from '@/lib/api/cart'

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalQty: 0,

  addToCart: async (product) => {
    const items = get().items
    const exist = items.find((i) => i.id === product.id)

    if (exist) {
      const newQty = Math.min(exist.qty + 1, exist.stock)
      if (newQty === exist.qty) return

      await updateCartItem(product.id as string, newQty)

      set({
        items: items.map((i) =>
          i.id === product.id ? { ...i, qty: newQty } : i
        ),
        totalQty: get().totalQty + 1,
      })
      return
    }

    await addCartItem(product.id as string, 1)

    const newItems: CartItem[] = [...items, { ...product, qty: 1 }]
    set({ items: newItems, totalQty: newItems.length })
  },

  updateItemQty: async (productId, quantity) => {
    const items = get().items
    const exist = items.find((i) => i.id === productId)
    if (!exist) return

    const clamped = Math.max(1, Math.min(quantity, exist.stock))
    if (clamped === exist.qty) return

    await updateCartItem(productId, clamped)

    const newItems = items.map((i) =>
      i.id === productId ? { ...i, qty: clamped } : i
    )
    const totalQty = newItems.reduce((sum, i) => sum + i.qty, 0)
    set({ items: newItems, totalQty })
  },

  removeFromCart: async (ids) => {
    const list = Array.isArray(ids) ? ids : [ids]

    await Promise.all(list.map((id) => removeCartItem(id)))

    const newItems = get().items.filter(i => !list.includes(i.id as string))
    set({
      items: newItems,
      totalQty: newItems.reduce((sum, i) => sum + i.qty, 0),
    })
  },

  clearCart: async () => {
    await clearCartApi()
    set({ items: [], totalQty: 0 })
  },

  fetchCart: async () => {
    try {
      const res = await getCart()
      const items: CartItem[] = (res?.items ?? []).map((item: { productId: string; productName: string; productImage?: string; price: number; stock: number; quantity: number }) => ({
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
      const totalQty = items.reduce((sum, i) => sum + i.qty, 0)
      set({ items, totalQty })
    } catch {
      set({ items: [], totalQty: 0 })
      throw new Error('Unable to load cart')
    }
  },
}))
