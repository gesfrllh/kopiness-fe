import Navbar from '@/components/Base/Navbar'
import React from 'react'

interface LayoutProps { 
  children: React.ReactNode
}

const layout: React.FC<LayoutProps> = ({children}) => {
  return (
    <>
      <Navbar/>
      <div>
        {children}
      </div>
    </>
  )
}

export default layout
