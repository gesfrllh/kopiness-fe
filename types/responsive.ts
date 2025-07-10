
type ScreenType = 'mobile' | 'tablet' | 'desktop'

export interface ResponsiveStore {
  screen: ScreenType,
  setScreen: (screen: ScreenType) => void,
  isMobile: boolean,
  isTablet: boolean,
  isDesktop: boolean
}