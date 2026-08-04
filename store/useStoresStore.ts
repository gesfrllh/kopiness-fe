import { create } from 'zustand'
import { Store } from '@/types/store'
import { getStores } from '@/lib/api/stores'

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
      set({ stores: [], loading: false })
    }
  },

  selectStore: (store) => set({ selectedStore: store }),
}))
