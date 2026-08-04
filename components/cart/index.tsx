'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import { useCartStore } from '@/store/useCartStore'
import { useProductStore } from '@/store/useProductStore'
import { formatCurrency } from '@/utils/general'
import { ProductResponse } from '@/types/product'
import Button from '@/components/Base/Button'
import CTA from '@/components/Base/cta'
import Link from 'next/link'
import { Modal } from '@/components/Base/ui/Modal/Modal'
import { ModalHeader, ModalBody } from '@/components/Base/ui/Modal/ModalCompunds'
import CardRoot from '@/components/Base/ui/Card'
import Tooltip from '@/components/Base/ui/Tooltip'
import AnimationLogin from '@/components/animation/AnimationLogin'
import Badge from '@/components/Base/Badge'

const CartPage = () => {
  const [openModal, setOpenModal] = useState(false)
  const [animate, setAnimate] = useState(false)

  const {
    items,
    totalQty,
    removeFromCart,
    clearCart,
    fetchCart,
    addToCart,
    updateItemQty,
  } = useCartStore()

  const {
    products,
    loading: productLoading,
    getProduct,
    setStoreId,
  } = useProductStore()

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  useEffect(() => {
    if (!openModal) return
    const storeId = document.cookie
      .split('; ')
      .find((r) => r.startsWith('store_id='))
      ?.split('=')[1]
    if (storeId) setStoreId(storeId)
    getProduct()
  }, [openModal, getProduct, setStoreId])

  useEffect(() => {
    if (!productLoading) {
      setAnimate(false)
      requestAnimationFrame(() => setAnimate(true))
    }
  }, [productLoading])

  const alreadyInCart = useCallback(
    (id?: string) => items.some((i) => i.id === id),
    [items]
  )

  const handleAddProduct = async (product: ProductResponse) => {
    try {
      await addToCart(product)
    } catch {
      // The cart remains unchanged when the server rejects the mutation.
    }
  }

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <>
      <div className="space-y-6">

        <CTA
          title="Cart"
          subtitle="Atur jumlah barang sebelum ke kasir"
          size="md"
          variant="gradient"
          icon={<Icon icon="mdi:cart" width={24} />}
          rightSlot={
            <div className="flex items-center gap-4">
              {items.length > 0 && (
                <span className="text-white/80 text-sm font-medium">
                  {totalQty} item{totalQty > 1 ? 's' : ''}
                </span>
              )}
              <Button
                className="bg-white text-amber-900 hover:bg-amber-50"
                onClick={() => setOpenModal(true)}
              >
                <Icon icon="mdi:plus" width={18} className="mr-1" />
                Tambah Item
              </Button>
              {items.length > 0 && (
                <Link href="/manage/checkout">
                  <Button className="bg-white text-amber-900 hover:bg-amber-50">
                    Checkout
                  </Button>
                </Link>
              )}
            </div>
          }
        />

        {/* 2-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          {/* LEFT: CART ITEMS */}
          <div className="lg:col-span-3">
            {items.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm">
                <div className="text-center py-24 space-y-4">
                  <Icon icon="mdi:cart-off" width={64} className="mx-auto text-gray-300" />
                  <h2 className="text-xl font-semibold text-gray-500">Keranjang Kosong</h2>
                  <p className="text-gray-400">Belum ada produk yang ditambahkan.</p>
                  <Button onClick={() => setOpenModal(true)}>Tambah Item</Button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-800">Cart Items</h2>
                    <p className="text-sm text-neutral-500">
                      {items.length} jenis produk &middot; {totalQty} item
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => void clearCart()}>
                    <Icon icon="mdi:delete-sweep" width={18} className="mr-1" />
                    Kosongkan
                  </Button>
                </div>

                <div className="p-6 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="w-16 h-16 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 overflow-hidden border border-amber-100">
                        {item.imageUrl?.[0] ? (
                          <Image
                            src={item.imageUrl[0]}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Icon icon="mdi:coffee" width={28} className="text-amber-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-neutral-800 truncate">{item.name}</h3>
                        <p className="text-xs text-neutral-400 truncate">
                          {item.flavorNotes || item.description}
                        </p>
                        <p className="text-sm font-bold text-amber-700 mt-0.5">
                          {formatCurrency(item.price)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            className="!px-2 !py-1 !min-w-[32px] !h-8"
                            onClick={() => updateItemQty(item.id as string, item.qty - 1)}
                            disabled={item.qty <= 1}
                          >
                            <Icon icon="mdi:minus" width={16} />
                          </Button>

                          <span className="w-8 text-center font-semibold text-sm">
                            {item.qty}
                          </span>

                          <Button
                            variant="outline"
                            className="!px-2 !py-1 !min-w-[32px] !h-8"
                            onClick={() => updateItemQty(item.id as string, item.qty + 1)}
                            disabled={item.qty >= item.stock}
                          >
                            <Icon icon="mdi:plus" width={16} />
                          </Button>
                        </div>

                        <div className="text-right min-w-[90px]">
                          <p className="text-xs text-gray-400">Subtotal</p>
                          <p className="text-sm font-bold text-neutral-800">
                            {formatCurrency(item.price * item.qty)}
                          </p>
                        </div>

                        <button
                          onClick={() => void removeFromCart(item.id as string)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Icon icon="mdi:delete-outline" width={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-neutral-200 px-6 py-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-neutral-500">Total</p>
                      <p className="text-3xl font-extrabold text-amber-700">
                        {formatCurrency(totalPrice)}
                      </p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <Button variant="outline" className="flex-1 sm:flex-initial" onClick={clearCart}>
                        Kosongkan
                      </Button>
                      <Link href="/manage/checkout" className="flex-1 sm:flex-initial">
                        <Button className="w-full">Lanjut ke Pembayaran</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: RINGKASAN KASIR */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 border border-var rounded-2xl p-5 bg-white card-shadow">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                {/* <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>point_of_sale</span> */}
                <h3 className="font-semibold text-sm">Ringkasan Kasir</h3>
              </div>

              <p className="text-xs text-gray-400 mb-3">
                Preview item yang akan muncul di kasir:
              </p>

              <div id="cashier-items" className="space-y-2 max-h-64 overflow-auto mb-4">
                {items.length === 0 ? (
                  <div className="text-center py-8 text-gray-300">
                    <span className="material-symbols-outlined text-4xl mb-2" style={{ fontSize: 36 }}>receipt_long</span>
                    <p className="text-xs">Belum ada item</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-dashed border-gray-100 last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-neutral-700 truncate">{item.name}</p>
                        <p className="text-[10px] text-gray-400">{formatCurrency(item.price)} &times; {item.qty}</p>
                      </div>
                      <span className="text-xs font-semibold text-neutral-800 ml-2">
                        {formatCurrency(item.price * item.qty)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-gray-200 pt-3 mt-3 space-y-1.5">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Qty</span>
                  <span>{totalQty} item</span>
                </div>
                <div className="flex justify-between text-base font-bold text-primary pt-1 border-t border-gray-100">
                  <span>Total</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-xs text-amber-800 flex items-start gap-1.5">
                  <span className="material-symbols-outlined" style={{ fontSize: 14, flexShrink: 0 }}>info</span>
                  Data ini akan muncul persis seperti ini di layar kasir saat checkout.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* MODAL TAMBAH ITEM */}
      <Modal open={openModal} onClose={() => setOpenModal(false)} size="xl">
        <ModalHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Tambah Item</h3>
              <p className="text-sm text-gray-500 mt-0.5">Pilih produk untuk ditambahkan ke keranjang</p>
            </div>
            <div onClick={() => setOpenModal(false)} className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition">
              <Tooltip content="Tutup">
                <Icon
                  icon="material-symbols:close-small-outline-rounded"
                  width={28}
                  height={28}
                  style={{ color: '#b63232ff' }}
                />
              </Tooltip>
            </div>
          </div>
        </ModalHeader>

        <ModalBody>
          {productLoading ? (
            <div className="flex items-center justify-center py-16">
              <AnimationLogin />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-auto pr-2">
              {products.map((product, index) => {
                const inCart = alreadyInCart(product.id)

                return (
                  <div
                    key={product.id}
                    className={`product-card ${animate ? 'show' : ''} cursor-pointer`}
                    style={{ transitionDelay: `${index * 80}ms` }}
                    onClick={() => {
                      if (!inCart) handleAddProduct(product)
                    }}
                  >
                    <CardRoot className={`${inCart ? 'opacity-50 pointer-events-none' : ''}`}>
                      <CardRoot.image src={product.imageUrl?.[0]} />
                      <CardRoot.content>
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <CardRoot.title
                              title={product.name}
                              subtitle={`Stock: ${product.stock}`}
                            />
                            <CardRoot.price value={product.price} />
                            {product.flavorNotes && (
                              <p className="text-xs text-gray-400 mt-1 truncate">
                                {product.flavorNotes}
                              </p>
                            )}
                          </div>
                          {inCart && (
                            <div className="shrink-0">
                              <Badge text={1} color="green" />
                            </div>
                          )}
                        </div>
                      </CardRoot.content>
                      <CardRoot.footer>
                        <Button
                          className="w-full"
                          disabled={inCart}
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation()
                            if (!inCart) handleAddProduct(product)
                          }}
                        >
                          {inCart ? 'Sudah di Keranjang' : 'Tambah ke Keranjang'}
                        </Button>
                      </CardRoot.footer>
                    </CardRoot>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <Icon icon="mdi:package-variant-closed" width={48} className="mx-auto mb-3" />
              <p>Tidak ada produk tersedia</p>
            </div>
          )}
        </ModalBody>
      </Modal>
    </>
  )
}

export default CartPage
