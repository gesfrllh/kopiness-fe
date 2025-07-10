'use client'

import { useEffect } from "react";
import { useResponsiveStore } from "@/store/useResponsiveStore";

export const useResponsiveHandler = () => {
  const setScreen = useResponsiveStore((state) => state.setScreen)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 768) setScreen('mobile')
      else if (width < 1028) setScreen('tablet')
      else setScreen("desktop")
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setScreen])
}