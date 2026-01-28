'use client'

import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = 'light' | 'dark'

interface ThemeContextProps {
  theme: Theme,
  toggleTheme: () => void;
  animateSpin: boolean
}

const ThemeContext = createContext<ThemeContextProps | null>(null)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light')
  const [animateSpin, setAnimateSpin] = useState<boolean>(false)

  const toggleTheme = () => {
    setAnimateSpin(true)
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
    setTimeout(() => setAnimateSpin(false), 1000)
  }

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme
    if (saved) setTheme(saved)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, animateSpin }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme Must be used inside ThemeProvider')
  return ctx
}