import Navbar from '@/components/Base/Navbar'
import React from 'react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className='bg-gray-200 h-screen px-8 pt-28'>
        {children}
      </div>
    </>
  )
}

export default Layout
