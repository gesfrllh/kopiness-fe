'use client'

import React from 'react'
import FormGroup from '@/components/Base/FormGroup'
import Link from 'next/link'
import { Icon } from '@iconify/react'

const page = () => {
  return (
    <>
      <div>
        <div className='px-8 rounded-lg shadow-md w-72 py-4 mt-4 bg-white'>
          <Link
            href="/manage/product"
            className='flex gap-2 items-center'>
            <Icon
              icon="material-symbols:arrow-circle-left"
              width={24} />
            Product Page
          </Link>
        </div>

        <div className='bg-white p-8 rounded-lg shadow-md mt-8 flex flex-col gap-6'>
          <div className='flex gap-8'>
            <FormGroup label="Product Name" >
              <input
                type="text"
                className='border border-gray-300 rounded-md px-3 py-2 w-full' />
            </FormGroup>
            <FormGroup label="Product Price" >
              <input
                type="text"
                className='border border-gray-300 rounded-md px-3 py-2 w-full' />
            </FormGroup>
          </div>
          <FormGroup label="Qty" >
            <input
              type="number"
              className='border border-gray-300 rounded-md px-3 py-2 w-full' />
          </FormGroup>
          <FormGroup label="Description" >
            <input
              type="text"
              className='border border-gray-300 rounded-md px-3 py-2 w-full' />
          </FormGroup>
        </div>
      </div>
    </>
  )
}

export default page
