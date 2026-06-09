import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useDashboardStore } from '@/store/useDashboardStore'

vi.mock('@/lib/api/dashboard', () => ({
  getDashboard: vi.fn(),
}))

import { getDashboard } from '@/lib/api/dashboard'

describe('useDashboardStore', () => {
  beforeEach(() => {
    useDashboardStore.setState({ data: null, loading: false, error: null })
    vi.clearAllMocks()
  })

  it('initial state is null', () => {
    const state = useDashboardStore.getState()
    expect(state.data).toBeNull()
    expect(state.loading).toBe(false)
  })

  it('getOverview loads data on success', async () => {
    const mockData = { stats: { totalRevenue: 100000, totalOrders: 50 }, recentTransactions: [], revenueChart: [], topProducts: [], paymentBreakdown: [] }
    vi.mocked(getDashboard).mockResolvedValue(mockData)

    await useDashboardStore.getState().getOverview()

    expect(useDashboardStore.getState().data).toEqual(mockData)
    expect(useDashboardStore.getState().loading).toBe(false)
  })

  it('getOverview throws on error', async () => {
    vi.mocked(getDashboard).mockRejectedValue(new Error('API Error'))

    await expect(useDashboardStore.getState().getOverview()).rejects.toThrow()
    expect(useDashboardStore.getState().loading).toBe(false)
  })
})
