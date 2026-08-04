import { create } from 'zustand'
import React from 'react'
import { HistoryDetails, HistoryPayload, HistoryResponseAdmin, HistoryResponseUser, } from '@/types/history'
import { formatError } from '@/utils/formatError'
import cleanPayload, { hydrateTrackingSteps } from '@/utils/general'
import { formatCurrency } from '@/utils/general'
import { Column } from '@/types'
import ActionCell from '@/components/history/components/ActionCell'
import { getDetail, getHistory } from '@/lib/api/history'

interface HistoryState {
  history: HistoryResponseAdmin[] | HistoryResponseUser[],
  localHistory: HistoryResponseAdmin[],
  details?: HistoryDetails | null,
  loading: boolean
  error?: string
  totalPages: number
  total: number
  search: string
  payload: HistoryPayload
  selectedStatus: string,
  columns: Column<HistoryResponseAdmin | HistoryResponseUser>[]
  getHistory: (query?: Partial<HistoryPayload>) => Promise<void>
  setPage: (page: number) => Promise<void>
  setLimit: (limit: number) => Promise<void>
  setSearch: (search: string) => Promise<void>
  setSelectedStatus: (select: string) => Promise<void>
  addLocalHistory: (entry: HistoryResponseAdmin | HistoryResponseUser) => void
  trackModal: {
    open: boolean;
    entry?: HistoryResponseAdmin | HistoryResponseUser | null;
  }
  openTrack: (entry: HistoryResponseAdmin | HistoryResponseUser) => void
  closeTrack: () => void,
  getDetails: (id: string) => Promise<void>
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: [],
  localHistory: [],
  loading: false,
  error: '',
  selectedStatus: '',
  totalPages: 1,
  details: null,
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
      accessor: 'status',
      render: (value, _) => {
        const styles: Record<string, string> = {
          PENDING: 'bg-[#E3F2FD] text-[#1565C0]',
          PAID: 'bg-[#E7F4EA] text-[#2E7D32]',
          ACCEPTED: 'bg-[#E3F2FD] text-[#1565C0]',
          REJECTED: 'bg-[#FDECEC] text-[#C62828]',
          PREPARING: 'bg-[#FFF3CD] text-[#856404]',
          HANDED_TO_COURIER: 'bg-[#F3E5F5] text-[#7B1FA2]',
          ON_DELIVERY: 'bg-amber-50 text-amber-700',
          DELIVERED: 'bg-[#D1E7DD] text-[#0F5132]',
          CANCELLED: 'bg-[#FFF4E5] text-[#E65100]',
        }
        return (
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[value as string] ?? ''}`}
          >
            {(value as string).toUpperCase()}
          </span>
        )
      },
    },
    {
      id: 'paymentMethod',
      header: 'Status Pembayaran',
      accessor: 'paymentMethod',
      render: (value, _) => <span className="block font-medium uppercase">{value as string}</span>,
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
      render: (_, row) => <ActionCell row={row} />
    },
  ],

  addLocalHistory: (entry: HistoryResponseAdmin | HistoryResponseUser) => {
    set({ localHistory: [entry as HistoryResponseAdmin, ...(get().localHistory || [])] })
  },

  // tracking modal handlers
  trackModal: { open: false, entry: null },
  openTrack: (entry: HistoryResponseAdmin | HistoryResponseUser) => {
    set({ trackModal: { open: true, entry } })
  },
  closeTrack: () => {
    set({ trackModal: { open: false, entry: null } })
  },

  getHistory: async (query?: Partial<HistoryPayload>) => {
    set({ loading: true, error: '' })
    try {
      const payload = { ...get().payload, ...query }
      const cleanedPayload = cleanPayload(payload)

      const res = await getHistory(cleanedPayload)
      set({
        history: res.data,
        localHistory: [],
        totalPages: res.meta.totalPages,
        total: res.meta.total,
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
  },

  setSelectedStatus: async (s: string) => {
    set({ selectedStatus: s })

    await get().getHistory({ status: s, page: 1 })
    // console.log(get().selectedStatus)
  },

  getDetails: async (id: string) => {
    set({ loading: true })
    try {
      const response = await getDetail(id)
      set({
        details: response,
        loading: false
      })
    } catch (err: unknown) {
      const message = formatError(err) || 'Error get History Details'
      set({ error: message })
      throw new Error(message)
    } finally {
      set({ loading: false })
    }
  }
}))
