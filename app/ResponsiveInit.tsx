'use client'

import { useEffect } from 'react'
import { useResponsiveHandler } from '@/hooks/useResponsiveHandler'
import { useAuthStore } from '@/store/useAuthStore'

const ResponsiveInit = () => {
  useResponsiveHandler()

  useEffect(() => {
    void useAuthStore.getState().hydrate()
    const clearSession = () => useAuthStore.getState().clearSession()
    window.addEventListener('auth:invalid-session', clearSession)
    return () => window.removeEventListener('auth:invalid-session', clearSession)
  }, [])

  return null
}

export default ResponsiveInit
