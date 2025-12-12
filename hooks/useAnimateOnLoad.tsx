'use client'

import { useEffect, useState } from "react"

export const useAnimateOnLoad = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return isLoaded
}