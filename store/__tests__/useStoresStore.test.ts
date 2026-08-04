import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useStoresStore } from '@/store/useStoresStore'

vi.mock('@/lib/api/stores', () => ({
  getStores: vi.fn(),
}))

import { getStores } from '@/lib/api/stores'

describe('useStoresStore', () => {
  beforeEach(() => {
    useStoresStore.setState({ stores: [], loading: false, selectedStore: null })
    vi.clearAllMocks()
  })

  it('initial state is empty', () => {
    expect(useStoresStore.getState().stores).toEqual([])
    expect(useStoresStore.getState().loading).toBe(false)
    expect(useStoresStore.getState().selectedStore).toBeNull()
  })

  it('selectStore updates selectedStore', () => {
    const store = { id: '1', name: 'Test', slug: 'test', address: 'Addr' }
    useStoresStore.getState().selectStore(store)
    expect(useStoresStore.getState().selectedStore).toEqual(store)
  })

  it('fetchStores sets stores from API on success', async () => {
    const mockStores = [{ id: '1', name: 'Kopiness', slug: 'kopiness', address: 'Jl. Test' }]
    vi.mocked(getStores).mockResolvedValue({ data: mockStores })

    await useStoresStore.getState().fetchStores()

    expect(useStoresStore.getState().stores).toEqual(mockStores)
    expect(useStoresStore.getState().loading).toBe(false)
  })

  it('fetchStores clears stores on API failure', async () => {
    vi.mocked(getStores).mockRejectedValue(new Error('Network error'))

    await useStoresStore.getState().fetchStores()

    const stores = useStoresStore.getState().stores
    expect(stores).toEqual([])
    expect(useStoresStore.getState().loading).toBe(false)
  })
})
