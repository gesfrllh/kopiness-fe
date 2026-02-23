import { create } from 'zustand'
import { DashboardOverview } from '@/types/dashboard'
import { getDashboard } from '@/pages/api/dashboard/api'
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
      // `getDashboard()` already returns the response data payload.
      set({
        loading: false,
        data: res.data
      })
    } catch (err: unknown) {
      throw new Error(formatError(err) || 'Error generate Coffee')
    } finally {
      set({ loading: false })
    }
  }
}))