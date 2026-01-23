'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useProductStore } from '@/store/useProductStore'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import Badge from '../Base/Badge'
import LoaderTransition from '../LoaderTransition'
import CTA from '../Base/cta'
import Pagination from '../Base/Pagination'
import Button from '../Base/Button'
import { Modal } from '../Base/ui/Modal/Modal'
import { ModalHeader, ModalBody } from '../Base/ui/Modal/ModalCompunds'
import CardRoot from '../Base/ui/Card'
import AnimationLogin from '../animation/AnimationLogin'
import Cookies from 'js-cookie'
import Tooltip from '../Base/ui/Tooltip'
import { ConfirmModal } from '../Base/ui/Modal/ConfirmModal'
import { useCartStore } from '@/store/useCartStore'
import { ProductResponse } from '@/types/product'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/utils/general'
import TextLabel from '../Base/TextLabel'

const Product = () => {
  const [loader, setLoader] = useState(false)
  const [open, setOpen] = useState(false)
  const [openDetail, setOpenDetail] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [selectedId, setSelectedId] = useState<string>('')
  const [selectToCart, setSelectToCart] = useState<ProductResponse>()
  const {
    products,
    page,
    limit,
    total,
    loading,
    productsById,
    totalPages,
    setPage,
    setLimit,
    setProductsId,
    getProduct,
    getProductByIds,
    removeProduct
  } = useProductStore()

  const { totalQty, addToCart, items } = useCartStore()

  const role = Cookies.get('role')
  const router = useRouter()

  useEffect(() => {
    getProduct()
  }, [page, limit])

  const addingToCart = (product: ProductResponse) => {
    if (product.stock <= 0) return

    addToCart(product)
  }
  const openDetails = async (id: string) => {
    if (!productsById) return
    setProductsId(id)
    const res = await getProductByIds()
    if(res !== undefined) {
      setOpenDetail(true)
    }
  }

  const editProduct = (id: string) => {
    router.push(`/manage/product/edit/${id}`)
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
                  {totalQty > 0 && (
                    <Badge text={totalQty} color="red" />
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

                      {role === 'ADMIN' && (
                        <div className='flex items-center justify-between'>
                          <div 
                            className='cursor-pointer'
                            onClick={() => editProduct(item.id as string)}>
                            <Tooltip content="edit">
                              <Icon
                                icon="material-symbols:edit-square-outline"
                                width={24}
                                height={24}
                                style={{ color: '#3291B6' }} />
                            </Tooltip>
                          </div>
                          <div 
                            className='cursor-pointer'
                            onClick={() => {
                              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                              setOpenModal(true),
                              setSelectedId(item.id as string)
                            }}
                            >
                            <Tooltip content="Hapus">
                              <Icon
                                icon="material-symbols:delete-outline"
                                width={26}
                                height={26}
                                style={{ color: '#DC0000' }} />
                            </Tooltip>
                          </div>
                        </div>
                      )}
                        <Button 
                          onClick={() => addingToCart(item)}>
                            Keranjang                            
                          </Button>
                      <Button 
                        onClick={() => openDetails(item.id as string)}>Detail</Button>
                    </CardRoot.footer>
                  </CardRoot>
                ))}
              </div>
              <div>
                {items.map((data) => (
                  <div key={data.id}>
                    {data.description}
                  </div>
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
          <ConfirmModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            onConfirm={() => {
              removeProduct(selectedId)
              setOpenModal(false)
            }}
            title='Apakah Data ini?'
            data='testing'
            description='Mau dihapus?'
            confirmText='Hapus'
            cancelText='Batal'
          />

          <Modal open={openDetail} onClose={() => setOpenDetail} size='xl'>
            <ModalHeader>
              <div className='flex justify-between items-center'>
                <p className='text-lg font-semibold'>Detail</p>
                <div onClick={() => (setOpenDetail(false))} className='cursor-pointer'>
                  <Tooltip content="Tutup">
                    <Icon
                      icon="material-symbols:close-small-outline-rounded"
                      width={36}
                      height={36}
                      style={{ color: '#b63232ff' }} />
                  </Tooltip>
                </div>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className='grid gap-8 grid-cols-3'>
                <div className='col-span-2'>
                  {productsById && productsById.imageUrl && (
                    <Image src={productsById.imageUrl[0]} alt="Product image" width={600} height={800} className='rounded-lg shadow-lg'/>
                  )}
                </div>
                <div className='border rounded-lg shadow-[8px_6px_0px_1px_#422900] px-8 py-4 w-auto'>
                  <div className='w-full'>
                    <p className='text-xl font-semibold'>{productsById.name}</p>
                    <div className='flex justify-between items-center py-4'>
                      <div>
                        <TextLabel 
                          dot 
                          size='md'
                          title={productsById.flavorNotes as string} 
                          />
                        <TextLabel 
                          dot 
                          size='md'
                          title={productsById.roastLevel as string} 
                          />
                      </div>
                      <div>
                        <TextLabel 
                          dot 
                          size='md'
                          title={productsById.process as string}/>
                        <TextLabel 
                          dot 
                          size='md'
                          title={productsById.origin as string}/>
                      </div>
                    </div>
                    <div className='flex items-end justify-end font-semibold border-b py-4'>
                      <TextLabel 
                        size='xl' 
                        dot={false} 
                        title={formatCurrency(productsById.price as number)}/>
                    </div>
                    <div className='py-4'>
                      <p>{productsById.description}</p>
                    </div>
                  </div>
                  <div>

                  </div>
                </div>
              </div>
            </ModalBody>
          </Modal>

          <Modal open={open} onClose={() => setOpen(false)} size='xl'>
            <ModalHeader>
              <div></div>
            </ModalHeader>
            <ModalBody>
              {totalQty}
              <div>
                {items.map((data) => (
                  <div key={data.id}>
                    {data.description} 
                  </div>
                ))}
              </div>
            </ModalBody>
          </Modal>
        </div>
      )}
      {loading ? <AnimationLogin /> : ''}
    </>
  )
}

export default Product
