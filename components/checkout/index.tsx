'use client'

import { Icon } from '@iconify/react'
import { useCartStore } from '@/store/useCartStore'
import { useHistoryStore } from '@/store/useHistory'
import { formatCurrency } from '@/utils/general'
import { createTransaction } from '@/lib/api/cashier'
import Button from '@/components/Base/Button'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CheckoutPage = () => {
  const { items, totalQty, clearCart } = useCartStore()
  const addLocalHistory = useHistoryStore((s) => s.addLocalHistory)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0)

  const handleCheckout = async () => {
    setSubmitting(true)

    try {
      await createTransaction({
        items: items.map((item) => ({
          productId: item.id as string,
          quantity: 1,
        })),
      })
    } catch {
      const { v4: uuid } = await import('uuid')
      const orderId = uuid().slice(0, 8)
      const trackingId = `TRK-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 6)}`

      addLocalHistory({
        id: orderId,
        orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        status: 'PENDING',
        total: totalPrice,
        paymentMethod: 'MANUAL',
        itemCount: items.length,
        createdAt: new Date().toISOString(),
        customer: { id: '', name: '', email: '' },
        tracking: {
          trackingId,
          status: 'PENDING',
          updatedAt: new Date().toISOString(),
          events: [
            { time: new Date().toISOString(), description: 'Pesanan dibuat' },
          ],
        },
      })
    }

    clearCart()
    setSubmitting(false)
    router.push('/manage/history')
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-24 space-y-4">
        <Icon icon="mdi:cart-off" width={64} className="mx-auto text-muted" />
        <h2 className="text-xl font-semibold">Tidak ada item</h2>
        <Link href="/manage/stores">
          <Button>Pilih Produk</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <div className="bg-white rounded-xl border shadow-sm p-5 space-y-4">
        <h2 className="font-semibold">Ringkasan Pesanan</h2>

        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-muted">{item.name}</span>
            <span className="font-medium">{formatCurrency(item.price)}</span>
          </div>
        ))}

        <div className="border-t pt-4 flex justify-between font-bold text-lg">
          <span>Total ({totalQty} item)</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-5 space-y-3">
        <p className="text-sm text-muted">
          Pembayaran akan dilakukan secara manual di store.
        </p>
        <Button
          className="w-full"
          onClick={handleCheckout}
          disabled={submitting}
        >
          {submitting ? 'Memproses...' : 'Buat Pesanan'}
        </Button>
      </div>
    </div>
  )
}

export default CheckoutPage
