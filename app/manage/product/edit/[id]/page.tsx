'use client'

import AddProduct from '@/components/product/add'
import React from 'react'
import { useParams } from 'next/navigation'

const Page = () => {
  const params = useParams<{id: string}>()
  const id = params?.id
  return (
    <>
      <AddProduct id={id as string} />
    </>
  )
}

export default Page