import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useHistoryActions } from '@/hooks/useHistoryActions'
import type { HistoryResponseAdmin } from '@/types/history'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

const mockRow: HistoryResponseAdmin = {
  id: '123',
  invoiceNumber: 'INV-001',
  orderNumber: 'ORD-001',
  status: 'PAID',
  total: 50000,
  createdAt: '2026-06-09T10:00:00Z',
  paymentMethod: 'CASH',
  itemCount: 3,
  customer: { id: 'c1', name: 'Budi', email: 'budi@test.com' },
}

describe('useHistoryActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns three actions', () => {
    const actions = useHistoryActions(mockRow)
    expect(actions).toHaveLength(3)
  })

  it('first action is Details', () => {
    const actions = useHistoryActions(mockRow)
    expect(actions[0].title).toBe('Details')
  })

  it('second action is Print', () => {
    const actions = useHistoryActions(mockRow)
    expect(actions[1].title).toBe('Print')
  })

  it('third action is Download Invoice', () => {
    const actions = useHistoryActions(mockRow)
    expect(actions[2].title).toBe('Download Invoice')
  })
})
