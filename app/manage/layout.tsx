import React from 'react'
import Sidebar from '@/components/Base/Sidebar'
import Navbar from '@/components/Base/Navbar'

interface LayoutProps {
  children: React.ReactNode,
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-shell flex min-h-screen">
      <Sidebar />
      <div className="app-content flex min-w-0 flex-1 flex-col transition-all duration-300">
        <Navbar />
        <main className="app-main flex-1 overflow-auto px-4 py-5 md:px-8 md:py-7 xl:px-12">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
