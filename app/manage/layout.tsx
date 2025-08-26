import React from 'react'
import Sidebar from '@/components/Base/Sidebar'

interface LayoutProps {
  children: React.ReactNode,
  header: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children, header }) => {
  return (
    <>
    <div className='flex'>
      <div className='relative z-50'>
        <Sidebar />
      </div>
      <div className='bg-gray-200 pl-52 relative h-screen  w-full overflow-hidden flex flex-col gap-8'>
        <div className='p-4 bg-white fixed shadow-[3px_10px_0px_0px_#422900] w-full z-10'>
            {header}
        </div>
        <div className='border-2 relative pl-16 z-0 h-full pt-24 overflow-auto'>
          {children}
        </div>
      </div>
    </div>
    </>
  )
}

export default Layout
