import { create } from 'zustand'
import { Store } from '@/types/store'
import { getStores } from '@/lib/api/stores'

const dummyStores: Store[] = [
  { id: '1', name: 'Kopiness Kemang', slug: 'kopiness-kemang', address: 'Jl. Kemang Raya No. 12, Jakarta Selatan' },
  { id: '2', name: 'Kopiness Bandung', slug: 'kopiness-bandung', address: 'Jl. Braga No. 45, Bandung' },
  { id: '3', name: 'Kopiness Surabaya', slug: 'kopiness-surabaya', address: 'Jl. Tunjungan No. 78, Surabaya' },
]

interface StoresState {
  stores: Store[]
  loading: boolean
  selectedStore: Store | null

  fetchStores: () => Promise<void>
  selectStore: (store: Store) => void
}

export const useStoresStore = create<StoresState>((set) => ({
  stores: [],
  loading: false,
  selectedStore: null,

  fetchStores: async () => {
    set({ loading: true })
    try {
      const res = await getStores()
      set({ stores: res?.data ?? [], loading: false })
    } catch {
      set({ stores: dummyStores, loading: false })
    }
  },

  selectStore: (store) => set({ selectedStore: store }),
}))
