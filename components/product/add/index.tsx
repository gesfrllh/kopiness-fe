'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'

import FormGroup from '@/components/Base/FormGroup'
import Select from '@/components/Base/Select'
import { roastLevelOptions } from '@/constants/roastLevelOptions'
import DropzoneImage from '@/components/Base/Dropzone'
import Button from '@/components/Base/Button'

type FormState = {
  name: string
  price: string
  stock: string
  description: string
  origin: string
  roastLevel: string
  process: string
  flavorNotes: string
  imageUrl: string
}

const initialState: FormState = {
  name: '',
  price: '',
  stock: '',
  description: '',
  origin: '',
  roastLevel: '',
  process: '',
  flavorNotes: '',
  imageUrl: '',
}

const AddProduct = () => {
  const [form, setForm] = useState<FormState>(initialState)

  const updateForm = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    }

    // console.log(payload)
    // hit API here
  }

  return (
    <div>
      {/* Back */}
      <div className='px-8 rounded-lg shadow-md w-72 py-4 mt-4 bg-white'>
        <Link href="/manage/product" className='flex gap-2 items-center'>
          <Icon icon="material-symbols:arrow-circle-left" width={24} />
          Product Page
        </Link>
      </div>

      {/* Form */}
      <div className='bg-white p-8 rounded-lg shadow-md mt-8 flex flex-col gap-6'>

        {/* Row 1 */}
        <div className='grid grid-cols-2 gap-8'>
          <FormGroup label="Product Name" required>
            <input
              value={form.name}
              onChange={(e) => updateForm('name', e.target.value)}
              className='border border-gray-300 rounded-md px-3 py-2 w-full'
            />
          </FormGroup>

          <FormGroup label="Price" required>
            <input
              type="number"
              value={form.price}
              onChange={(e) => updateForm('price', e.target.value)}
              className='border border-gray-300 rounded-md px-3 py-2 w-full'
            />
          </FormGroup>
        </div>

        {/* Row 2 */}
        <div className='grid grid-cols-2 gap-8'>
          <FormGroup label="Stock" required>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => updateForm('stock', e.target.value)}
              className='border border-gray-300 rounded-md px-3 py-2 w-full'
            />
          </FormGroup>

          <FormGroup label="Origin" required>
            <input
              value={form.origin}
              onChange={(e) => updateForm('origin', e.target.value)}
              className='border border-gray-300 rounded-md px-3 py-2 w-full'
            />
          </FormGroup>
        </div>

        {/* Roast Level */}
        <Select
          label="Roast Level"
          name="roastLevel"
          value={form.roastLevel}
          onChange={(val) => updateForm('roastLevel', val)}
          options={roastLevelOptions}
          required
        />

        {/* Process */}
        <FormGroup label="Process" required>
          <input
            value={form.process}
            onChange={(e) => updateForm('process', e.target.value)}
            className='border border-gray-300 rounded-md px-3 py-2 w-full'
          />
        </FormGroup>

        {/* Flavor Notes */}
        <FormGroup label="Flavor Notes" required>
          <input
            value={form.flavorNotes}
            onChange={(e) => updateForm('flavorNotes', e.target.value)}
            className='border border-gray-300 rounded-md px-3 py-2 w-full'
          />
        </FormGroup>

        {/* Description */}
        <FormGroup label="Description" required>
          <textarea
            value={form.description}
            onChange={(e) => updateForm('description', e.target.value)}
            rows={4}
            className='border border-gray-300 rounded-md px-3 py-2 w-full'
          />
        </FormGroup>

        {/* Image */}
      <DropzoneImage uploadUrl='/api/uploads' value='' onChange={(url) => updateForm('imageUrl', url)}/>

        {/* Action */}
        <div className='flex justify-end'>
          <Button
            variant='outline'
            onClick={handleSubmit}
          >
            Save Product
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddProduct
