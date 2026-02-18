import { create } from 'zustand'
import { useAuthStore } from './useAuthStore'
import { HistoryPayload, HistoryResponseAdmin, HistoryResponseUser } from '@/types/history'
import { getHistory } from '@/pages/api/history/history'
import { formatError } from '@/utils/formatError'
import cleanPayload from '@/utils/general'
import { formatCurrency } from '@/utils/general'
import ActionDropdown from '@/components/history/components/ActionDropdown'
import { Column } from '@/types'

interface HistoryState {
  history: HistoryResponseAdmin[] | HistoryResponseUser[]
  loading: boolean
  error?: string
  totalPages: number
  total: number
  search: string
  payload: HistoryPayload
  columns: Column<HistoryResponseAdmin | HistoryResponseUser>[] // kita bisa bikin generic nanti kalau mau type-safe
  getHistory: (query?: Partial<HistoryPayload>) => Promise<void>
  setPage: (page: number) => Promise<void>
  setLimit: (limit: number) => Promise<void>
  setSearch: (search: string) => Promise<void>
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: [],
  loading: false,
  error: '',
  totalPages: 1,
  total: 0,
  search: '',
  payload: {
    page: 1,
    limit: 10,
    status: '',
    method: '',
    userId: '',
    startDate: '',
    endDate: ''
  },
  columns: [
    {
      id: 'orderNumber',
      header: 'Order Number',
      render: (_, row) => (
        <span className="font-semibold text-[#5A2D0C] cursor-pointer hover:underline">
          {row.orderNumber ?? '-'}
        </span>
      ),
    },
    {
      id: 'invoiceNumber',
      header: 'Invoice Number',
      render: (_, row) => (
        <span className="font-semibold text-[#5A2D0C] cursor-pointer hover:underline">
          {row.invoiceNumber ?? '-'}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status', // ✅ karena status ada langsung di interface
      render: (value, _) => {
        const styles: Record<string, string> = {
          PAID: 'bg-[#E7F4EA] text-[#2E7D32]',
          PENDING: 'bg-[#E3F2FD] text-[#1565C0]',
          CANCELLED: 'bg-[#FFF4E5] text-[#E65100]',
        }
        return (
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[value as string] ?? ''
              }`}
          >
            {(value as string).toUpperCase()}
          </span>
        )
      },
    },
    {
      id: 'paymentMethod',
      header: 'Metode Pembayaran',
      accessor: 'paymentMethod',
      render: (value, _) => <span className="block font-medium">{value as string}</span>,
    },
    {
      id: 'itemCount',
      header: 'Jumlah Item',
      accessor: 'itemCount',
      render: (value, _) => <span className="block px-8 font-medium">{value as number}</span>,
    },
    {
      id: 'total',
      header: 'Total',
      accessor: 'total',
      render: (value, _) => <span className="block font-medium">{formatCurrency(value as number)}</span>,
    },
    {
      id: 'actions',
      header: '',
      render: (_, __) => <ActionDropdown />,
    },
  ],

  getHistory: async (query?: Partial<HistoryPayload>) => {
    set({ loading: true, error: '' })
    try {
      const payload = { ...get().payload, ...query }
      const cleanedPayload = cleanPayload(payload)

      const res = await getHistory(cleanedPayload)
      set({
        history: res.data.data,
        totalPages: res.data.meta.totalPages,
        total: res.data.meta.total,
        payload
      })
    } catch (err: unknown) {
      const message = formatError(err) || 'Error get History'
      set({ error: message })
      throw new Error(message)
    } finally {
      set({ loading: false })
    }
  },

  setPage: async (page: number) => {
    await get().getHistory({ page })
  },

  setLimit: async (limit: number) => {
    await get().getHistory({ limit, page: 1 })
  },

  setSearch: async (q: string) => {
    set({ search: q })
    await get().getHistory({ search: get().search, page: 1 })
  }
}))
