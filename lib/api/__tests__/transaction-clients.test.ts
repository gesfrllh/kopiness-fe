import { describe, expect, it, vi } from 'vitest'
import { createTransaction } from '@/lib/api/cashier'
import { updateOrderStatus } from '@/lib/api/order'

const { post, patch } = vi.hoisted(() => ({ post: vi.fn(), patch: vi.fn() }))

vi.mock('@/lib/api', () => ({ default: { post, patch } }))

describe('transaction clients', () => {
  it('posts checkout payload to transaction endpoint', async () => {
    post.mockResolvedValue({ data: { id: 'order-1' } })
    const payload = {
      items: [{ productId: 'coffee-1', quantity: 2 }],
      deliveryAddress: 'Jalan Kopi 1',
      deliveryLatitude: -6.2,
      deliveryLongitude: 106.8,
    }

    await expect(createTransaction(payload)).resolves.toEqual({ id: 'order-1' })
    expect(post).toHaveBeenCalledWith('/transactions', payload)
  })

  it('patches requested order status', async () => {
    patch.mockResolvedValue({ data: { id: 'order-1', status: 'DELIVERED' } })

    await expect(updateOrderStatus('order-1', 'DELIVERED')).resolves.toEqual({ id: 'order-1', status: 'DELIVERED' })
    expect(patch).toHaveBeenCalledWith('/transactions/order-1/status', { status: 'DELIVERED' })
  })
})
