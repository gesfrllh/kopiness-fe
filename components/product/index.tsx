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
import FormInput from '../Base/FormInput'

const Product = () => {
  const [loader, setLoader] = useState(false)
  const [open, setOpen] = useState(false)
  const [openDetail, setOpenDetail] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [selectedId, setSelectedId] = useState<string>('')
  const [selectToCart, setSelectToCart] = useState<ProductResponse>()
  const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({})
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
    updateDraftStock,
    getDisplayQty,
    getDisplayStock,
    getProduct,
    commitStockChanges,
    getProductByIds,
    removeProduct
  } = useProductStore()

  const { totalQty, addToCart, items, removeFromCart } = useCartStore()
  const selectedIds = Object.keys(checkedItems).filter(
    id => checkedItems[id]
  )

  const role = Cookies.get('role')
  const router = useRouter()

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  useEffect(() => {
    getProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit])

  const addingToCart = (product: ProductResponse) => {
    if (product.stock <= 0) return

    addToCart(product)
  }

  const hasChecked = Object.values(checkedItems).some(Boolean)

  const openDetails = async (id: string) => {
    if (!productsById) return
    setProductsId(id)
    const res = await getProductByIds()
    if (res !== undefined) {
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
          <div className="bg-colors-var rounded-lg my-8 py-4 px-8">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-300">
              <span>Product</span>
              <div className="flex items-center gap-8">
                <Button variant="outline">
                  <Link href="/manage/product/add">Add Product</Link>
                </Button>

                <div
                  className="relative cursor-pointer"
                  onClick={() => {
                    setOpen(true)
                  }}
                >
                  {items.length > 0 && (
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
            {products.length > 0 ? (

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
                                setSelectToCart(item)
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
            ) : (
              <div className='h-full flex items-center justify-center py-8'>
                <p>
                  Belum Ada Produk
                </p>
              </div>
            )}
          </div>

          {/* Modal */}
          <ConfirmModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            onConfirm={() => {
              removeProduct(selectedId)
              setOpenModal(false)
            }}
            title='Apakah anda yakin?'
            data={selectToCart?.name}
            description={`${selectToCart?.name}`}
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
                    <div className="relative  h-[400px] overflow-hidden rounded-lg shadow-lg">
                      <Image
                        src={productsById.imageUrl[0]}
                        alt="Product image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className='border-var rounded-lg shadow-[8px_6px_0px_1px_#422900] px-8 py-4 w-auto'>
                  <div className='w-full'>
                    <p className='text-xl font-semibold'>{productsById.name}</p>
                    <div className='flex justify-between items-center py-4'>
                      <div className='flex flex-col gap-2'>
                        <TextLabel
                          dot
                          size='xs'
                          title={productsById.flavorNotes as string}
                        />
                        <TextLabel
                          dot
                          size='xs'
                          title={productsById.roastLevel as string}
                        />
                      </div>
                      <div className='flex flex-col gap-2'>
                        <TextLabel
                          dot
                          size='xs'
                          title={productsById.process as string} />
                        <TextLabel
                          dot
                          size='xs'
                          title={productsById.origin as string} />
                      </div>
                    </div>
                    <div className='flex items-end justify-end font-semibold bg-colors-var-b py-4'>
                      <TextLabel
                        size='xl'
                        dot={false}
                        title={formatCurrency(productsById.price as number)} />
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
              <div className='flex justify-between items-center'>
                <p className='text-lg font-semibold'>Keranjang</p>
                <div onClick={() => (setOpen(false))} className='cursor-pointer p-2'>
                  <Tooltip content="Tutup">
                    <Icon
                      onClick={() => (setOpen(false))}
                      icon="material-symbols:close-small-outline-rounded"
                      width={36}
                      height={36}
                      style={{ color: '#b63232ff' }} />
                  </Tooltip>
                </div>
              </div>
            </ModalHeader>
            <ModalBody>
              {items.length > 0 ? (
                <div>
                  <div className='max-h-96 p-4 overflow-auto flex flex-col gap-4 relative'>
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className='shadow-[8px_6px_0px_1px_#422900] border-var rounded-lg flex gap-4 p-8 items-center'
                      >
                        <FormInput
                          type="checkbox"
                          name={`item-${item.id}`}
                          checked={checkedItems[item.id as string] as boolean ?? false}
                          onChange={() => toggleItem(item.id as string)}
                          className="w-5 h-5"
                        />

                        <div className='w-32 rounded-lg'>
                          <Image
                            className='w-[200px] rounded-lg h-[100px] object-cover'
                            src={item.imageUrl[0]}
                            width={400}
                            height={400}
                            alt={item.name}
                          />
                        </div>

                        <div className='flex justify-between w-full'>
                          <div className='flex flex-col gap-8'>
                            <div className='flex flex-col'>
                              <TextLabel size='xl' title={item.name} dot />
                              <p className='text-xs px-6'>
                                {item.description}
                              </p>
                            </div>
                            <div className='px-6'>
                              <p className='font-semibold'>
                                {formatCurrency(item.price)}
                              </p>
                              <p className='text-xs text-gray-600'>
                                {item.flavorNotes}
                              </p>
                            </div>
                          </div>
                          <div className='flex gap-4 items-center'>
                            <Button
                              variant='outline'
                              onClick={() => updateDraftStock(item.id as string, -1)}
                              disabled={!checkedItems[item.id as string]}>
                              <p>-</p>
                            </Button>

                            <div className='flex gap-2 w-18 justify-center px-4'>
                              <p>{getDisplayQty(item)}</p>
                              <span>/</span>
                              <p className='text-gray-400'>{getDisplayStock(item)}</p>
                            </div>

                            <Button
                              variant='outline'
                              onClick={() => updateDraftStock(item.id as string, 1)}
                              disabled={!checkedItems[item.id as string]}>
                              <p>+</p>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className='pt-6 text-end'>
                    <Button variant='outline'
                      disabled={!hasChecked}
                      onClick={() => {
                        commitStockChanges()
                        setOpen(false)
                        removeFromCart(selectedIds)
                      }}>
                      Submit
                    </Button>
                  </div>
                  {/* <Table<ProductResponse> columns={columns} data={items} /> */}
                </div>
              ) : (
                <div>
                  Data Tidak ditemukan.
                </div>
              )}
            </ModalBody>

          </Modal>
        </div>
      )}
      {loading ? <AnimationLogin /> : ''}
    </>
  )
}

export default Product
