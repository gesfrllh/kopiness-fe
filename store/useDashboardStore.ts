import { create } from 'zustand'
import { DashboardOverview } from '@/types/dashboard'
import { getDashboard } from '@/lib/api/dashboard'
import { formatError } from '@/utils/formatError'

interface DashboardState {
  data: DashboardOverview | null,
  loading: boolean,
  error: string | null,
  getOverview: () => Promise<void>
}

export const useDashboardStore = create<DashboardState>((set) => ({
  data: null,
  loading: false,
  error: null,

  getOverview: async () => {
    set({ loading: true })
    try {
      const res = await getDashboard();
      set({
        loading: false,
        data: res
      })

    } catch (err: unknown) {
      throw new Error(formatError(err) || 'Error generate Coffee')
    } finally {
      set({ loading: false })
    }
  }
}))