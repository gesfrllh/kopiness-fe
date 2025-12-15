import Product from '@/components/product'
import LoaderTransition from '@/components/LoaderTransition'
import React from 'react'

const page = () => {
  return (
    <>
      <LoaderTransition />
      <div>
        <Product />
      </div>
    </>
  )
}

export default page
