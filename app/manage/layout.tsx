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
      <div className='bg-gray-200 relative h-screen  w-full overflow-hidden flex flex-col gap-8'>
        <div className=' relative px-16 z-0 h-full py-24 overflow-hidden'>
          {children}
        </div>
      </div>
    </div>
    </>
  )
}

export default Layout
