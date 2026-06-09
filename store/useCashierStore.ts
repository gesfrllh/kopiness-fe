import { create } from 'zustand'
import {
  deleteProduct,
  getCashier,
  getPaymentType,
  payment,
} from '@/lib/api/cashier'
import { CashierResponse, PaymentListRequest, PaymentListResponse } from '@/types/cashier'
import { AccordionItem } from '@/types'
import { useHistoryStore } from '@/store/useHistory'
import { formatError } from '@/utils/formatError'
import { showNotify } from '@/components/Base/notification/notify-controllers'

interface CashierState {
  // ===== DATA =====
  Cashier: CashierResponse[]
  paymentList: PaymentListResponse[]
  loading: boolean
  error: string

  // ===== UI STATE =====
  selected: AccordionItem[]
  deleted: AccordionItem | null
  openModal: boolean
  choosePayment: boolean
  selectedPayment?: PaymentListResponse

  // ===== DATA ACTIONS =====
  getCashier: () => Promise<void>
  getPayment: () => Promise<void>
  removeProduct: (id: string) => Promise<void>
  submitPayment: () => Promise<void>

  // ===== UI ACTIONS =====
  setSelected: (items: AccordionItem[]) => void
  setDeleted: (item: AccordionItem | null) => void
  setOpenModal: (v: boolean) => void
  setChoosePayment: (v: boolean) => void
  setSelectedPayment: (p?: PaymentListResponse) => void
  resetUI: () => void
}

export const useCashierStore = create<CashierState>((set, get) => ({
  // ===== DATA =====
  Cashier: [],
  paymentList: [],
  loading: false,
  error: '',

  // ===== UI STATE =====
  selected: [],
  deleted: null,
  openModal: false,
  choosePayment: false,
  selectedPayment: undefined,

  // ===== UI ACTIONS =====
  setSelected: (items) => set({ selected: items }),

  setDeleted: (item) => set({ deleted: item }),

  setOpenModal: (v) => set({ openModal: v }),

  setChoosePayment: (v) => set({ choosePayment: v }),

  setSelectedPayment: (p) => set({ selectedPayment: p }),

  resetUI: () =>
    set({
      selected: [],
      deleted: null,
      openModal: false,
      choosePayment: false,
      selectedPayment: undefined,
    }),

  // ===== DATA ACTIONS =====
  getCashier: async () => {
    set({ loading: true, error: '' })
    try {
      const res = await getCashier()
      set({ Cashier: res })
    } catch (err: unknown) {
      const message = formatError(err) || 'Error get Cashier'
      set({ error: message })
      throw new Error(message)
    } finally {
      set({ loading: false })
    }
  },

  getPayment: async () => {
    set({ loading: true, error: '' })
    try {
      const res = await getPaymentType()
      set({ paymentList: res.methods })
    } catch (err: unknown) {
      const message = formatError(err) || 'Error get Payment List'
      set({ error: message })
      throw new Error(message)
    } finally {
      set({ loading: false })
    }
  },

  removeProduct: async (id: string) => {
    set({ loading: true, error: '' })
    try {
      await deleteProduct(id)
      showNotify({
        text: 'Produk berhasil dicancel',
        title: 'Sukses',
        type: 'success',
      })
      await get().getCashier()
    } catch (err: unknown) {
      const message = formatError(err) || 'Error cancel Product'
      set({ error: message })
      showNotify({
        text: message,
        title: 'Gagal',
        type: 'error',
      })
      throw new Error(message)
    } finally {
      set({ loading: false })
    }
  },

  submitPayment: async () => {
    set({ loading: true });
    const { selected, selectedPayment } = get()

    if (selected.length === 0) {
      showNotify({
        title: 'Gagal',
        text: 'Tidak ada transaksi yang dipilih',
        type: 'error',
      })
      return
    }

    if (!selectedPayment) {
      showNotify({
        title: 'Gagal',
        text: 'Silakan pilih metode pembayaran',
        type: 'error',
      })
      return
    }

    const payload: PaymentListRequest = {
      transactionIds: selected.map((item) => item.id),
      method: selectedPayment.id
    }

    try {
      await payment(payload)
      showNotify({
        title: 'Sukses',
        text: 'Pembayaran berhasil',
        type: 'success',
      })

      // attach basic tracking info locally for each paid transaction
      try {
        const addLocal = useHistoryStore.getState().addLocalHistory
        selected.forEach((item) => {
          const trackingId = `TRK-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 6)}`
          const histEntry = {
            id: item.id,
            status: 'PAID' as const,
            total: item.subTotal,
            paymentMethod: selectedPayment?.name ?? selectedPayment?.id ?? 'CASH',
            itemCount: 1,
            createdAt: new Date().toISOString(),
            invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
            tracking: {
              trackingId,
              status: 'PENDING' as const,
              updatedAt: new Date().toISOString(),
              events: [
                { time: new Date().toISOString(), description: 'Pembayaran diterima' }
              ]
            }
          }

          addLocal(histEntry)
        })
      } catch (e) {
        // non-fatal: local tracking failed
        console.warn('addLocalHistory failed', e)
      }

      get().resetUI()
      await get().getCashier()
      set({ loading: false });
    } catch (err: unknown) {
      const message = formatError(err) || 'Gagal submit pembayaran'
      showNotify({
        title: 'Gagal',
        text: message,
        type: 'error',
      })
      set({ loading: false });
      throw new Error(message)
    }
  },
}))
