import { create } from 'zustand'
import { Order } from '@/types/order'
import { getOrders, updateOrderStatus } from '@/lib/api/order'
import { showNotify } from '@/components/Base/notification/notify-controllers'
import { formatError } from '@/utils/formatError'

const dummyOrders: Order[] = [
  { id: 'ORD-001', customer: 'Budi', customerPhone: '08123456789', status: 'PAID', deliveryStatus: 'IN_PROGRESS', total: 120000 },
  { id: 'ORD-002', customer: 'Andi', customerPhone: '08198765432', status: 'PAID', deliveryStatus: 'DELIVERED', total: 90000 },
  { id: 'ORD-003', customer: 'Siti', customerPhone: '0815556677', status: 'PENDING', deliveryStatus: 'IN_PROGRESS', total: 150000 },
]

interface OrderState {
  orders: Order[]
  loading: boolean
  updating: string | null

  fetchOrders: () => Promise<void>
  setDeliveryStatus: (id: string, status: 'IN_PROGRESS' | 'DELIVERED') => Promise<void>
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  loading: false,
  updating: null,

  fetchOrders: async () => {
    set({ loading: true })
    try {
      const res = await getOrders({})
      const data = res?.data ?? []
      set({ orders: data, loading: false })
    } catch {
      set({ orders: dummyOrders, loading: false })
    }
  },

  setDeliveryStatus: async (id, status) => {
    set({ updating: id })
    try {
      await updateOrderStatus(id, status)
      set({
        orders: get().orders.map((o) =>
          o.id === id ? { ...o, deliveryStatus: status } : o
        ),
        updating: null,
      })
      showNotify({
        type: 'success',
        title: 'Sukses',
        text: `Status diubah ke ${status.replace(/_/g, ' ')}`,
      })
    } catch (err) {
      showNotify({
        type: 'error',
        title: 'Gagal',
        text: formatError(err),
      })
      set({ updating: null })
    }
  },
}))
