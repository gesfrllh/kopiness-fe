import { create } from 'zustand'
import { Order, OrderStatus } from '@/types/order'
import { getOrders, updateOrderStatus } from '@/lib/api/order'
import { showNotify } from '@/components/Base/notification/notify-controllers'
import { formatError } from '@/utils/formatError'

interface OrderState {
  orders: Order[]
  loading: boolean
  updating: string | null

  fetchOrders: () => Promise<void>
  setOrderStatus: (id: string, status: OrderStatus) => Promise<void>
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
    } catch (err) {
      set({ orders: [], loading: false })
      showNotify({
        type: 'error',
        title: 'Gagal memuat pesanan',
        text: formatError(err),
      })
    }
  },

  setOrderStatus: async (id, status) => {
    set({ updating: id })
    try {
      await updateOrderStatus(id, status)
      set({
        orders: get().orders.map((o) =>
          o.id === id ? { ...o, status } : o
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
