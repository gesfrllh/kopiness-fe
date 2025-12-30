'use client'

import React, { useEffect, useState } from 'react'
import { useProductStore } from '@/store/useProductStore'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import Badge from '../Base/Badge'
import LoaderTransition from '../LoaderTransition'
import CTA from '../Base/cta'
import Pagination from '../Base/Pagination'
import Button from '../Base/Button'
import { Modal } from '../Base/ui/Modal/Modal'
import { ModalHeader, ModalBody, ModalFooter } from '../Base/ui/Modal/ModalCompunds'
import CardRoot from '../Base/ui/Card'
import AnimationLogin from '../animation/AnimationLogin'

const Product = () => {
  const [loader, setLoader] = useState(false)
  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(false)

  const {
    products,
    page,
    limit,
    total,
    loading,
    setPage,
    setLimit,
    totalPages,
    getProduct,
  } = useProductStore()

  useEffect(() => {
    getProduct()
  }, [page, limit])

  const addingToCart = () => {
    setCount((prev) => prev + 1)
  }

  return (
    <>
      <LoaderTransition onFinish={() => setLoader(true)} />

      {loader && (
        <div>
          <CTA title="Product Cta" />

          <div className="bg-white rounded-lg my-8 py-4 px-8">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-300">
              <span>Product</span>

              <div className="flex items-center gap-8">
                <Button variant="outline">
                  <Link href="/manage/product/add">Add Product</Link>
                </Button>

                <div
                  className="relative cursor-pointer"
                  onClick={() => setOpen(true)}
                >
                  {count > 0 && (
                    <Badge text={count} color="red" />
                  )}

                  <Icon
                    icon="material-symbols-light:shopping-cart-rounded"
                    width={32}
                    height={32}
                    style={{ color: '#92400E' }}
                  />
                </div>
              </div>
            </div>

            {/* Product List */}
            <div className="flex flex-col gap-8">
              <div className="flex gap-12 py-8 justify-center flex-wrap">
                {products.map((item) => (
                  <CardRoot key={item.id}>
                    <CardRoot.image src={item.imageUrl?.[0]} />

                    <CardRoot.content>
                      <CardRoot.title
                        title={item.name}
                        subtitle={`Stock: ${item.stock}`}
                      />
                      <CardRoot.price value={item.price} />
                    </CardRoot.content>

                    <CardRoot.footer>
                      <Button onClick={addingToCart}>Keranjang</Button>
                      <Button>Detail</Button>
                    </CardRoot.footer>
                  </CardRoot>
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                page={page}
                limit={limit}
                totalPages={totalPages}
                totalData={total}
                siblingCount={1}
                boundaryCount={1}
                onPageChange={setPage}
                onLimitChange={setLimit}
              />
            </div>
          </div>

          {/* Modal */}
          <Modal open={open} onClose={() => setOpen(false)} size="lg">
            <ModalHeader>
              <h3 className="text-xl font-bold">Delete Product</h3>
              <p className="text-sm text-gray-500">
                This action cannot be undone
              </p>
            </ModalHeader>

            <ModalBody>
              <p>Are you sure you want to delete this product?</p>
            </ModalBody>

            <ModalFooter>
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button className="bg-red-600 text-white px-4 py-2 rounded">
                Delete
              </button>
            </ModalFooter>
          </Modal>
        </div>
      )}
      {loading ? <AnimationLogin /> : ''}
    </>
  )
}

export default Product
