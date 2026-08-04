import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useOrderStore } from '@/store/useOrderStore'

vi.mock('@/lib/api/order', () => ({
  getOrders: vi.fn(),
  updateOrderStatus: vi.fn(),
}))

import { getOrders, updateOrderStatus } from '@/lib/api/order'

describe('useOrderStore', () => {
  beforeEach(() => {
    useOrderStore.setState({ orders: [], loading: false, updating: null })
    vi.clearAllMocks()
  })

  it('initial state is empty', () => {
    expect(useOrderStore.getState().orders).toEqual([])
    expect(useOrderStore.getState().loading).toBe(false)
  })

  it('fetchOrders loads from API', async () => {
    const mockOrders = [
      { id: 'ORD-001', customer: 'Budi', status: 'PAID', total: 120000 },
    ]
    vi.mocked(getOrders).mockResolvedValue({ data: mockOrders })

    await useOrderStore.getState().fetchOrders()

    expect(useOrderStore.getState().orders).toEqual(mockOrders)
    expect(useOrderStore.getState().loading).toBe(false)
  })

  it('fetchOrders clears orders on API failure', async () => {
    vi.mocked(getOrders).mockRejectedValue(new Error('Network error'))

    await useOrderStore.getState().fetchOrders()

    const orders = useOrderStore.getState().orders
    expect(orders).toEqual([])
  })

  it('setOrderStatus updates order status', async () => {
    vi.mocked(updateOrderStatus).mockResolvedValue(undefined)

    useOrderStore.setState({
      orders: [{ id: 'ORD-001', customer: 'Budi', status: 'PAID', total: 120000 }],
    })

    await useOrderStore.getState().setOrderStatus('ORD-001', 'DELIVERED')

    const order = useOrderStore.getState().orders[0]
    expect(order.status).toBe('DELIVERED')
    expect(useOrderStore.getState().updating).toBeNull()
  })

  it('setOrderStatus handles API error', async () => {
    vi.mocked(updateOrderStatus).mockRejectedValue(new Error('Failed'))

    useOrderStore.setState({
      orders: [{ id: 'ORD-001', customer: 'Budi', status: 'PAID', total: 120000 }],
    })

    await useOrderStore.getState().setOrderStatus('ORD-001', 'DELIVERED')

    const order = useOrderStore.getState().orders[0]
    expect(order.status).toBe('PAID')
    expect(useOrderStore.getState().updating).toBeNull()
  })
})
