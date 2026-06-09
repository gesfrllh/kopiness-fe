import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePagination } from '@/hooks/usePagination'
import { useResponsiveStore } from '@/store/useResponsiveStore'

describe('usePagination', () => {
  beforeEach(() => {
    useResponsiveStore.getState().setScreen('desktop')
  })

  it('returns all pages when totalPage fits within limit', () => {
    const { result } = renderHook(() => usePagination({ page: 1, totalPage: 5, siblingCount: 1, boundaryCount: 1 }))
    expect(result.current!).toEqual([1, 2, 3, 4, 5])
  })

  it('shows dots for large page counts', () => {
    const { result } = renderHook(() => usePagination({ page: 5, totalPage: 20, siblingCount: 1, boundaryCount: 1 }))
    expect(result.current!).toContain('...')
    expect(result.current![0]).toBe(1)
    expect(result.current![result.current!.length - 1]).toBe(20)
  })

  it('shows left dots and right dots', () => {
    const { result } = renderHook(() => usePagination({ page: 10, totalPage: 20, siblingCount: 1, boundaryCount: 1 }))
    expect(result.current!.filter(r => r === '...').length).toBe(2)
  })

  it('returns smaller range on mobile', () => {
    useResponsiveStore.getState().setScreen('mobile')
    const { result } = renderHook(() => usePagination({ page: 10, totalPage: 20, siblingCount: 1, boundaryCount: 1 }))
    expect(result.current!.filter(r => r === '...').length).toBe(0)
  })

  it('handles edge case: page 1 of large set', () => {
    const { result } = renderHook(() => usePagination({ page: 1, totalPage: 100, siblingCount: 1, boundaryCount: 1 }))
    expect(result.current!).toContain('...')
    expect(result.current![0]).toBe(1)
  })
})
