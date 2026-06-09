import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useProductStore } from '@/store/useProductStore'

vi.mock('@/lib/api/productApi', () => ({
  getProduct: vi.fn(),
  getProductById: vi.fn(),
  addProduct: vi.fn(),
  editProduct: vi.fn(),
  deleteProduct: vi.fn(),
}))

vi.mock('@/lib/api/cart', () => ({
  addCartItem: vi.fn(),
}))

import { getProduct, addProduct, editProduct, deleteProduct, getProductById } from '@/lib/api/productApi'
import { addCartItem } from '@/lib/api/cart'

describe('useProductStore', () => {
  beforeEach(() => {
    useProductStore.setState({
      products: [],
      productsById: { id: '' },
      draftQty: {},
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      loading: false,
      error: null,
      storeId: '',
      search: '',
      productsId: '',
      modalDetail: false,
    })
    vi.clearAllMocks()
  })

  it('initial state', () => {
    const state = useProductStore.getState()
    expect(state.products).toEqual([])
    expect(state.page).toBe(1)
    expect(state.loading).toBe(false)
  })

  it('setStoreId updates storeId', () => {
    useProductStore.getState().setStoreId('store-1')
    expect(useProductStore.getState().storeId).toBe('store-1')
  })

  it('updateDraftStock updates draft quantity', () => {
    useProductStore.setState({ products: [{ id: 'prod-1', stock: 10 } as any] })
    useProductStore.getState().updateDraftStock('prod-1', 3)
    expect(useProductStore.getState().draftQty['prod-1']).toBe(3)
  })

  it('updateDraftStock caps at stock limit', () => {
    useProductStore.setState({ products: [{ id: 'prod-1', stock: 5 } as any] })
    useProductStore.getState().updateDraftStock('prod-1', 10)
    expect(useProductStore.getState().draftQty['prod-1']).toBe(5)
  })

  it('updateDraftStock does not go below 0', () => {
    useProductStore.setState({ products: [{ id: 'prod-1', stock: 5 } as any], draftQty: { 'prod-1': 2 } })
    useProductStore.getState().updateDraftStock('prod-1', -5)
    expect(useProductStore.getState().draftQty['prod-1']).toBe(0)
  })

  it('getProduct loads from API', async () => {
    const mockData = { data: [{ id: 'p1', name: 'Coffee' }], meta: { total: 1, totalPages: 1 } }
    vi.mocked(getProduct).mockResolvedValue(mockData)

    await useProductStore.getState().getProduct()

    expect(useProductStore.getState().products).toEqual(mockData.data)
    expect(useProductStore.getState().total).toBe(1)
  })

  it('addProducts calls API and refreshes', async () => {
    vi.mocked(addProduct).mockResolvedValue(undefined)
    vi.mocked(getProduct).mockResolvedValue({ data: [], meta: { total: 0, totalPages: 0 } })

    await useProductStore.getState().addProducts({ name: 'New Coffee', price: 25000 } as any)

    expect(addProduct).toHaveBeenCalled()
  })

  it('removeProduct deletes and refreshes', async () => {
    vi.mocked(deleteProduct).mockResolvedValue(undefined)
    vi.mocked(getProduct).mockResolvedValue({ data: [], meta: { total: 0, totalPages: 0 } })

    await useProductStore.getState().removeProduct('prod-1')

    expect(deleteProduct).toHaveBeenCalledWith('prod-1')
  })

  it('decreaseStock reduces product stock by 1', () => {
    useProductStore.setState({ products: [{ id: 'p1', name: 'Coffee', stock: 10 } as any] })
    useProductStore.getState().decreaseStock('p1')
    expect(useProductStore.getState().products[0].stock).toBe(9)
  })

  it('resetProductById resets product detail', () => {
    useProductStore.setState({ productsById: { id: 'p1', name: 'Test' } as any })
    useProductStore.getState().resetProductById()
    expect(useProductStore.getState().productsById).toEqual({ id: '' })
  })
})
