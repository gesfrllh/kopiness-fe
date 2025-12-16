import React from 'react'
import Sidebar from '@/components/Base/Sidebar'

interface LayoutProps {
  children: React.ReactNode,
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
    <div className='flex'>
      <div className='relative z-50'>
        <Sidebar />
      </div>
      <div className='relative h-full w-full flex flex-col gap-8'>
        <div className='bg-gray-200 relative px-4 md:px-16 z-0  py-24'>
          {children}
        </div>
      </div>
    </div>
    </>
  )
}

export default Layout
