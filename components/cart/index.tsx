'use client'

import { useEffect } from 'react'
import { Icon } from '@iconify/react'
import { useCartStore } from '@/store/useCartStore'
import { formatCurrency } from '@/utils/general'
import Button from '@/components/Base/Button'
import Link from 'next/link'

const CartPage = () => {
  const { items, totalQty, removeFromCart, clearCart, fetchCart } = useCartStore()

  useEffect(() => {
    fetchCart()
  }, [fetchCart])
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0)

  if (items.length === 0) {
    return (
      <div className="text-center py-24 space-y-4">
        <Icon icon="mdi:cart-off" width={64} className="mx-auto text-muted" />
        <h2 className="text-xl font-semibold">Keranjang Kosong</h2>
        <p className="text-muted">Belum ada produk yang ditambahkan.</p>
        <Link href="/manage/stores">
          <Button>Lihat Store</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Keranjang</h1>
        <span className="text-sm text-muted">{totalQty} item</span>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border shadow-sm p-4 flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <Icon icon="mdi:coffee" width={28} className="text-amber-400" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{item.name}</h3>
              <p className="text-sm text-muted">{formatCurrency(item.price)}</p>
            </div>

            <button
              onClick={() => removeFromCart(item.id as string)}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <Icon icon="mdi:delete-outline" width={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-5 space-y-3">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={clearCart}>
            Kosongkan
          </Button>
          <Link href="/manage/checkout" className="flex-1">
            <Button className="w-full text-xs sm:text-sm whitespace-nowrap">Lanjut ke Pembayaran</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CartPage
