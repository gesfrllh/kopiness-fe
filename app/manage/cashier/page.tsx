import Cashier from '@/components/cashier'
import LoaderTransition from '@/components/LoaderTransition'
import React from 'react'

const page = () => {
  return (
    <>
      <LoaderTransition />
      <div>
        <Cashier />
      </div>
    </>
  )
}

export default page
