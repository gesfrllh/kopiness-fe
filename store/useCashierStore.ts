import { deleteProduct, getCashier } from '@/pages/api/cashier/api'
import { CashierResponse } from '@/types/cashier'
import { create } from 'zustand'
import { formatError } from '@/utils/formatError'
import { showNotify } from '@/components/Base/notification/notify-controllers'

interface CashierState {
  Cashier: CashierResponse[],
  loading: boolean,
  error: string,
  getCashier: () => Promise<void>,
  removeProduct: (id: string) => Promise<void>
}

export const useCashierStore = create<CashierState>((set, get) => ({
  Cashier: [],
  loading: false,
  error: '',

  getCashier: async () => {
    set({ loading: true })

    try {
      const res = await getCashier()
      set({ Cashier: res.data })
      set({ loading: false })
    } catch (err: unknown) {
      const message = formatError(err) || 'Error get Product';
      set({ error: message });
      set({ loading: false })
      throw new Error(message);
    }
  },

  removeProduct: async (id: string) => {
    set({ loading: true })

    try {
      await deleteProduct(id)
      showNotify({
        text: 'Produk berhasil dicancel',
        title: 'Sukses',
        type: 'success'
      })
      set({ loading: false })
      await get().getCashier()
    } catch (err: unknown) {
      const message = formatError(err) || 'Error cancel Product';
      set({ error: message });
      showNotify({
        text: message,
        title: 'Gagal',
        type: 'error'
      })
      set({ loading: false })
      throw new Error(message)
    }
  }
}))