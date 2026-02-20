'use client'

import { useEffect } from 'react'
import { useResponsiveHandler } from '@/hooks/useResponsiveHandler'
import { useAuthStore } from '@/store/useAuthStore'

const ResponsiveInit = () => {
  useResponsiveHandler()

  // Hydrate auth store from localStorage on mount
  useEffect(() => {
    // Always call hydrate on client mount to ensure localStorage is loaded
    // and isHydrated flag is set for proper component rendering
    const hydrate = useAuthStore.getState().hydrate
    hydrate()
  }, [])

  return null
}

export default ResponsiveInit
