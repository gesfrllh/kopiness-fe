import { deleteProduct, getCashier, getPaymentType } from '@/pages/api/cashier/api'
import { CashierResponse, PaymentListResponse } from '@/types/cashier'
import { create } from 'zustand'
import { formatError } from '@/utils/formatError'
import { showNotify } from '@/components/Base/notification/notify-controllers'

interface CashierState {
  Cashier: CashierResponse[],
  paymentList: PaymentListResponse[],
  loading: boolean,
  error: string,
  getCashier: () => Promise<void>,
  getPayment: () => Promise<void>,
  removeProduct: (id: string) => Promise<void>
}

export const useCashierStore = create<CashierState>((set, get) => ({
  Cashier: [],
  loading: false,
  error: '',
  paymentList: [],

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
    } finally {
      set({ loading: false })
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
    } finally {
      set({ loading: false })
    }
  },

  getPayment: async () => {
    set({ loading: true });
    try {
      const res = await getPaymentType();
      set({ paymentList: res.data.methods });
      set({ loading: false })
    } catch (err: unknown) {
      const message = formatError(err) || 'Error get Payment List';
      set({ error: message });
      set({ loading: false })
      throw new Error(message);
    } finally {
      set({ loading: false })
    }
  },
}))