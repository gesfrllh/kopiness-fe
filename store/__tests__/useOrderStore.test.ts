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
      { id: 'ORD-001', customer: 'Budi', status: 'PAID', deliveryStatus: 'IN_PROGRESS', total: 120000 },
    ]
    vi.mocked(getOrders).mockResolvedValue({ data: mockOrders })

    await useOrderStore.getState().fetchOrders()

    expect(useOrderStore.getState().orders).toEqual(mockOrders)
    expect(useOrderStore.getState().loading).toBe(false)
  })

  it('fetchOrders uses dummy on failure', async () => {
    vi.mocked(getOrders).mockRejectedValue(new Error('Network error'))

    await useOrderStore.getState().fetchOrders()

    const orders = useOrderStore.getState().orders
    expect(orders.length).toBeGreaterThan(0)
    expect(orders[0]).toHaveProperty('customer')
  })

  it('setDeliveryStatus updates order status', async () => {
    vi.mocked(updateOrderStatus).mockResolvedValue(undefined)

    useOrderStore.setState({
      orders: [{ id: 'ORD-001', customer: 'Budi', status: 'PAID', deliveryStatus: 'IN_PROGRESS', total: 120000 }],
    })

    await useOrderStore.getState().setDeliveryStatus('ORD-001', 'DELIVERED')

    const order = useOrderStore.getState().orders[0]
    expect(order.deliveryStatus).toBe('DELIVERED')
    expect(useOrderStore.getState().updating).toBeNull()
  })

  it('setDeliveryStatus handles API error', async () => {
    vi.mocked(updateOrderStatus).mockRejectedValue(new Error('Failed'))

    useOrderStore.setState({
      orders: [{ id: 'ORD-001', customer: 'Budi', status: 'PAID', deliveryStatus: 'IN_PROGRESS', total: 120000 }],
    })

    await useOrderStore.getState().setDeliveryStatus('ORD-001', 'DELIVERED')

    const order = useOrderStore.getState().orders[0]
    expect(order.deliveryStatus).toBe('IN_PROGRESS')
    expect(useOrderStore.getState().updating).toBeNull()
  })
})
