import { getCashier } from '@/pages/api/cashier/api'
import { CashierResponse } from '@/types/cashier'
import { create } from 'zustand'
import { formatError } from '@/utils/formatError'

interface CashierState {
  Cashier: CashierResponse[],
  loading: boolean,
  error: string,
  getCashier: () => Promise<void>,
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
  }
}))