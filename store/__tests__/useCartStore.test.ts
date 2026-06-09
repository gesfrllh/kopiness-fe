import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useCartStore } from '@/store/useCartStore'

vi.mock('@/lib/api/cart', () => ({
  addCartItem: vi.fn(),
  removeCartItem: vi.fn(),
  clearCartApi: vi.fn(),
  getCart: vi.fn(),
}))

import { addCartItem, removeCartItem, clearCartApi, getCart } from '@/lib/api/cart'

const product = {
  id: 'prod-1',
  name: 'Kopi Arabika',
  price: 50000,
  imageUrl: [],
  stock: 10,
  origin: 'Java',
  process: 'Washed',
  flavorNotes: 'Fruity',
  roastLevel: 'MEDIUM' as const,
  secTitle: 'Specialty',
  description: 'Delicious coffee',
}

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], totalQty: 0 })
    vi.clearAllMocks()
  })

  it('initial state is empty', () => {
    expect(useCartStore.getState().items).toEqual([])
    expect(useCartStore.getState().totalQty).toBe(0)
  })

  it('addToCart adds item', async () => {
    vi.mocked(addCartItem).mockResolvedValue(undefined)
    await useCartStore.getState().addToCart(product)
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().totalQty).toBe(1)
  })

  it('addToCart does not add duplicate', async () => {
    vi.mocked(addCartItem).mockResolvedValue(undefined)
    await useCartStore.getState().addToCart(product)
    await useCartStore.getState().addToCart(product)
    expect(useCartStore.getState().items).toHaveLength(1)
  })

  it('removeFromCart removes item by id', async () => {
    vi.mocked(addCartItem).mockResolvedValue(undefined)
    vi.mocked(removeCartItem).mockResolvedValue(undefined)

    await useCartStore.getState().addToCart(product)
    expect(useCartStore.getState().items).toHaveLength(1)

    await useCartStore.getState().removeFromCart('prod-1')
    expect(useCartStore.getState().items).toHaveLength(0)
    expect(useCartStore.getState().totalQty).toBe(0)
  })

  it('clearCart empties cart', async () => {
    vi.mocked(addCartItem).mockResolvedValue(undefined)
    vi.mocked(clearCartApi).mockResolvedValue(undefined)

    await useCartStore.getState().addToCart(product)
    await useCartStore.getState().clearCart()

    expect(useCartStore.getState().items).toEqual([])
    expect(useCartStore.getState().totalQty).toBe(0)
  })

  it('fetchCart loads items from API', async () => {
    vi.mocked(getCart).mockResolvedValue({
      items: [
        {
          productId: 'prod-1',
          productName: 'Kopi Arabika',
          productImage: '/img.jpg',
          price: 50000,
          stock: 10,
          quantity: 2,
        },
      ],
    })

    await useCartStore.getState().fetchCart()

    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].name).toBe('Kopi Arabika')
    expect(useCartStore.getState().items[0].qty).toBe(2)
    expect(useCartStore.getState().totalQty).toBe(1)
  })

  it('fetchCart keeps local state on API failure', async () => {
    vi.mocked(getCart).mockRejectedValue(new Error('Network error'))

    await useCartStore.getState().fetchCart()

    expect(useCartStore.getState().items).toEqual([])
  })
})
