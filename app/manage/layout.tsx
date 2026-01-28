import React from 'react'
import Sidebar from '@/components/Base/Sidebar'
import ThemeToggle from '@/components/ThemeToggle'

interface LayoutProps {
  children: React.ReactNode,
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-auto">
      <div className="relative z-50">
        <ThemeToggle />
        <Sidebar />
      </div>

      <div className="relative w-full flex flex-col min-h-0">
        <div className="bg-inside flex-1 overflow-auto px-4 md:px-16 py-24">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout
