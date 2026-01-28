'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'

import FormGroup from '@/components/Base/FormGroup'
import Select from '@/components/Base/Select'
import { roastLevelOptions } from '@/constants/roastLevelOptions'
import DropzoneImage from '@/components/Base/Dropzone'
import Button from '@/components/Base/Button'
import { useProductStore } from '@/store/useProductStore'
import { ProductRequest } from '@/types/product'
import { useRouter } from 'next/navigation'
import AnimationLogin from '@/components/animation/AnimationLogin'

type FormState = {
  name: string
  price: string
  stock: string
  description: string
  origin: string
  roastLevel: string
  process: string
  flavorNotes: string
  imageUrl: string[]
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
  imageUrl: [],
}

type Props = {
  id?: string,
}

const AddProduct = ({ id }: Props) => {
  const isEdit = Boolean(id)
  const [form, setForm] = useState<FormState>(initialState)

  const updateForm = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const {
    productsById,
    error,
    loading,
    resetProductById,
    addProducts,
    updateProduct,
    getProductByIds,
    setProductsId,
  } = useProductStore()

  const router = useRouter()

  useEffect(() => {
    if (!id) {
      setForm(initialState)
      setProductsId(undefined)
      resetProductById()
    }
  }, [id])

  useEffect(() => {
    if (!id) return

    setProductsId(id)
    getProductByIds()
  }, [id])

  useEffect(() => {
    if (!isEdit) return
    if (!productsById?.id) return

    setForm({
      name: productsById.name ?? '',
      price: String(productsById.price ?? ''),
      stock: String(productsById.stock ?? ''),
      description: productsById.description ?? '',
      origin: productsById.origin ?? '',
      roastLevel: productsById.roastLevel ?? '',
      process: productsById.process ?? '',
      flavorNotes: productsById.flavorNotes ?? '',
      imageUrl: productsById.imageUrl ?? [],
    })
  }, [productsById, isEdit])

  const handleSubmit = async () => {
    const payload: ProductRequest = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    }

    if (isEdit) {
      updateProduct(id as string, payload)
    } else {
      addProducts(payload)
    }
    if (!error) {
      router.push('/manage/product')
    }
  }

  return (
    <div>
      {/* Back */}
      <div className='px-8 rounded-lg shadow-md w-72 py-4 mt-4 bg-colors-var'>
        <Link href="/manage/product" className='flex gap-2 items-center'>
          <Icon icon="material-symbols:arrow-circle-left" width={24} />
          Product Page
        </Link>
      </div>

      {/* Form */}
      <div className='bg-colors-var p-8 rounded-lg shadow-md mt-8 flex flex-col gap-6'>

        {/* Row 1 */}
        <div className='grid md:grid-cols-2 gap-8'>
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
        <div className='grid md:grid-cols-2 gap-8'>
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
        <DropzoneImage
          uploadUrl="/api/uploads"
          value={form.imageUrl}
          onChange={(urls) => updateForm('imageUrl', urls)}
        />

        {/* Action */}
        <div className='flex justify-end'>
          <Button
            variant='outline'
            onClick={handleSubmit}
          >
            {isEdit ? 'Edit Product' : 'Save Product'}
          </Button>
        </div>
      </div>
      {loading ? <AnimationLogin /> : ''}
    </div>
  )
}

export default AddProduct
