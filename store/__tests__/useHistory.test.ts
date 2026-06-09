import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useHistoryStore } from '@/store/useHistory'

vi.mock('@/lib/api/history', () => ({
  getHistory: vi.fn(),
  getDetail: vi.fn(),
}))

import { getHistory, getDetail } from '@/lib/api/history'

describe('useHistoryStore', () => {
  beforeEach(() => {
    useHistoryStore.setState({
      history: [],
      localHistory: [],
      loading: false,
      error: '',
      totalPages: 1,
      total: 0,
      search: '',
      details: null,
      selectedStatus: '',
      trackModal: { open: false, entry: null },
    })
    vi.clearAllMocks()
  })

  it('initial state', () => {
    const state = useHistoryStore.getState()
    expect(state.history).toEqual([])
    expect(state.loading).toBe(false)
    expect(state.totalPages).toBe(1)
  })

  it('addLocalHistory prepends entry', () => {
    const entry = { id: 'local-1', status: 'PAID', total: 50000 } as any
    useHistoryStore.getState().addLocalHistory(entry)
    expect(useHistoryStore.getState().localHistory).toHaveLength(1)
    expect(useHistoryStore.getState().localHistory[0].id).toBe('local-1')
  })

  it('openTrack sets track modal', () => {
    const entry = { id: '1', status: 'PAID', total: 50000 } as any
    useHistoryStore.getState().openTrack(entry)
    expect(useHistoryStore.getState().trackModal.open).toBe(true)
    expect(useHistoryStore.getState().trackModal.entry?.id).toBe('1')
  })

  it('closeTrack resets track modal', () => {
    useHistoryStore.getState().openTrack({ id: '1' } as any)
    useHistoryStore.getState().closeTrack()
    expect(useHistoryStore.getState().trackModal.open).toBe(false)
    expect(useHistoryStore.getState().trackModal.entry).toBeNull()
  })

  it('getHistory loads data from API', async () => {
    const mockResponse = {
      data: [{ id: 'hist-1', status: 'PAID', total: 50000 }],
      meta: { totalPages: 2, total: 15 },
    }
    vi.mocked(getHistory).mockResolvedValue(mockResponse)

    await useHistoryStore.getState().getHistory()

    expect(useHistoryStore.getState().history).toEqual(mockResponse.data)
    expect(useHistoryStore.getState().totalPages).toBe(2)
    expect(useHistoryStore.getState().loading).toBe(false)
  })

  it('getHistory throws on error', async () => {
    vi.mocked(getHistory).mockRejectedValue(new Error('Failed'))

    await expect(useHistoryStore.getState().getHistory()).rejects.toThrow()
    expect(useHistoryStore.getState().loading).toBe(false)
  })

  it('getDetails loads detail', async () => {
    const detail = { id: '1', tracking: { events: [] } }
    vi.mocked(getDetail).mockResolvedValue(detail)

    await useHistoryStore.getState().getDetails('1')

    expect(useHistoryStore.getState().details).toEqual(detail)
  })

  it('setPage calls getHistory with updated page', async () => {
    vi.mocked(getHistory).mockResolvedValue({ data: [], meta: { totalPages: 1, total: 0 } })

    await useHistoryStore.getState().setPage(3)

    expect(getHistory).toHaveBeenCalled()
  })
})
