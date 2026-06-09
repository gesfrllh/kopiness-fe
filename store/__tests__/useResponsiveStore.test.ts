import { describe, it, expect, beforeEach } from 'vitest'
import { useResponsiveStore } from '@/store/useResponsiveStore'

describe('useResponsiveStore', () => {
  beforeEach(() => {
    useResponsiveStore.setState({ screen: 'desktop', isMobile: false, isTablet: false, isDesktop: true })
  })

  it('initial state is desktop', () => {
    expect(useResponsiveStore.getState().screen).toBe('desktop')
    expect(useResponsiveStore.getState().isDesktop).toBe(true)
    expect(useResponsiveStore.getState().isMobile).toBe(false)
    expect(useResponsiveStore.getState().isTablet).toBe(false)
  })

  it('setScreen updates to mobile', () => {
    useResponsiveStore.getState().setScreen('mobile')
    expect(useResponsiveStore.getState().screen).toBe('mobile')
    expect(useResponsiveStore.getState().isMobile).toBe(true)
    expect(useResponsiveStore.getState().isDesktop).toBe(false)
  })

  it('setScreen updates to tablet', () => {
    useResponsiveStore.getState().setScreen('tablet')
    expect(useResponsiveStore.getState().screen).toBe('tablet')
    expect(useResponsiveStore.getState().isTablet).toBe(true)
    expect(useResponsiveStore.getState().isMobile).toBe(false)
  })
})
