import { ResponsiveStore } from '@/types/responsive'
import { create } from 'zustand'

export const useResponsiveStore = create<ResponsiveStore>((set) => ({
  screen: 'desktop',
  setScreen: (screen) =>
    set({
      screen,
      isMobile: screen === 'mobile',
      isTablet: screen === 'tablet',
      isDesktop: screen === 'desktop'
    }),
  isMobile: false,
  isTablet: false,
  isDesktop: true
}))