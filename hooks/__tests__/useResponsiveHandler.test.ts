import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useResponsiveHandler } from '@/hooks/useResponsiveHandler'
import { useResponsiveStore } from '@/store/useResponsiveStore'

describe('useResponsiveHandler', () => {
  beforeEach(() => {
    useResponsiveStore.getState().setScreen('desktop')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('sets mobile when width < 768', () => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(500)
    renderHook(() => useResponsiveHandler())
    expect(useResponsiveStore.getState().screen).toBe('mobile')
    expect(useResponsiveStore.getState().isMobile).toBe(true)
  })

  it('sets tablet when width between 768 and 1028', () => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(900)
    renderHook(() => useResponsiveHandler())
    expect(useResponsiveStore.getState().screen).toBe('tablet')
    expect(useResponsiveStore.getState().isTablet).toBe(true)
  })

  it('sets desktop when width >= 1028', () => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1200)
    renderHook(() => useResponsiveHandler())
    expect(useResponsiveStore.getState().screen).toBe('desktop')
    expect(useResponsiveStore.getState().isDesktop).toBe(true)
  })
})
