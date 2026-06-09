import { describe, it, expect } from 'vitest'
import cleanPayload, { formatCurrency, Range, groupByMonth, formatDate, hydrateTrackingSteps } from '@/utils/general'
import type { PaymentHistory, StepsTracking } from '@/types/history'

describe('formatCurrency', () => {
  it('formats number as IDR currency without decimals', () => {
    expect(formatCurrency(15000)).toBe('Rp\u00a015.000')
  })

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('Rp\u00a00')
  })

  it('handles large numbers', () => {
    expect(formatCurrency(1000000)).toBe('Rp\u00a01.000.000')
  })

  it('defaults to 0 when no value provided', () => {
    expect(formatCurrency()).toBe('Rp\u00a00')
  })
})

describe('Range', () => {
  it('generates range from start to end inclusive', () => {
    expect(Range(1, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('returns single element when start equals end', () => {
    expect(Range(3, 3)).toEqual([3])
  })

  it('returns empty array when start > end', () => {
    expect(Range(5, 3)).toEqual([])
  })

  it('handles zero-based range', () => {
    expect(Range(0, 3)).toEqual([0, 1, 2, 3])
  })
})

describe('groupByMonth', () => {
  it('groups payments by month and year', () => {
    const payments: PaymentHistory[] = [
      { createdAt: '2026-01-15T10:00:00Z' } as PaymentHistory,
      { createdAt: '2026-01-20T10:00:00Z' } as PaymentHistory,
      { createdAt: '2026-02-10T10:00:00Z' } as PaymentHistory,
    ]
    const result = groupByMonth(payments)
    expect(result['January 2026']).toHaveLength(2)
    expect(result['February 2026']).toHaveLength(1)
  })

  it('returns empty object for empty array', () => {
    expect(groupByMonth([])).toEqual({})
  })
})

describe('cleanPayload', () => {
  it('removes empty string, null, and undefined values', () => {
    const result = cleanPayload({ a: 'hello', b: '', c: null, d: undefined, e: 0 })
    expect(result).toEqual({ a: 'hello', e: 0 })
  })

  it('returns empty object when all values are empty', () => {
    expect(cleanPayload({ a: '', b: null, c: undefined })).toEqual({})
  })

  it('keeps falsy but valid values like 0 and false', () => {
    const result = cleanPayload({ count: 0, active: false, name: 'test' })
    expect(result).toEqual({ count: 0, active: false, name: 'test' })
  })
})

describe('formatDate', () => {
  it('formats with short type by default', () => {
    const result = formatDate('2026-06-09T12:00:00Z')
    expect(result).toContain('9')
    expect(result).toContain('Jun')
    expect(result).toContain('2026')
  })

  it('formats with long type', () => {
    const result = formatDate('2026-06-09T12:00:00Z', 'long')
    expect(result).toContain('2026')
  })

  it('formats with withTime type', () => {
    const result = formatDate('2026-06-09T12:00:00Z', 'withTime')
    expect(result).toContain('2026')
  })

  it('formats with time type', () => {
    const result = formatDate('2026-06-09T12:00:00Z', 'time')
    expect(result.length).toBeGreaterThan(0)
  })

  it('returns dash for invalid date', () => {
    expect(formatDate('not-a-date')).toBe('-')
  })

  it('accepts Date object', () => {
    const result = formatDate(new Date(2026, 5, 9))
    expect(result).toContain('Jun')
  })
})

describe('hydrateTrackingSteps', () => {
  const steps: StepsTracking[] = [
    { action: 'created', active: false, completed: false, label: 'CREATED', step: 0, timeStamp: '' },
    { action: 'started', active: false, completed: false, label: 'PAYMENT_STARTED', step: 1, timeStamp: '' },
    { action: 'paid', active: false, completed: false, label: 'PAID', step: 2, timeStamp: '' },
    { action: 'cancelled', active: false, completed: false, label: 'CANCELLED', step: 3, timeStamp: '' },
  ]

  it('marks all steps before current as completed', () => {
    const result = hydrateTrackingSteps(steps, 'PAID')
    expect(result[0]).toMatchObject({ completed: true, active: false })
    expect(result[1]).toMatchObject({ completed: true, active: false })
    expect(result[2]).toMatchObject({ completed: true, active: true })
    expect(result[3]).toMatchObject({ completed: false, active: false })
  })

  it('handles first step as current', () => {
    const result = hydrateTrackingSteps(steps, 'CREATED')
    expect(result[0]).toMatchObject({ completed: true, active: true })
    expect(result[1]).toMatchObject({ completed: false, active: false })
  })

  it('handles last step as current', () => {
    const result = hydrateTrackingSteps(steps, 'CANCELLED')
    expect(result[0]).toMatchObject({ completed: true, active: false })
    expect(result[2]).toMatchObject({ completed: true, active: false })
    expect(result[3]).toMatchObject({ completed: true, active: true })
  })

  it('handles unknown status (all inactive)', () => {
    const result = hydrateTrackingSteps(steps, 'UNKNOWN')
    expect(result.every(s => s.active === false)).toBe(true)
    expect(result.every(s => s.completed === false)).toBe(true)
  })
})
