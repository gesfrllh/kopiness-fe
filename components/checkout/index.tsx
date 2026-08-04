'use client'

import { Icon } from '@iconify/react'
import { useCartStore } from '@/store/useCartStore'
import { formatCurrency } from '@/utils/general'
import { createTransaction } from '@/lib/api/cashier'
import Button from '@/components/Base/Button'
import Link from 'next/link'
import { useState } from 'react'
import dynamic from 'next/dynamic'

const DestinationPicker = dynamic(() => import('@/components/map/DestinationPicker'), { ssr: false })
import { useRouter } from 'next/navigation'

const CheckoutPage = () => {
  const { items, totalQty, clearCart } = useCartStore()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null)
  const router = useRouter()
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0)

  const handleCheckout = async () => {
    setSubmitting(true)
    setError(null)

    try {
      await createTransaction({
        items: items.map((item) => ({
          productId: item.id as string,
          quantity: item.qty,
        })),
        deliveryAddress,
        deliveryLatitude: destination!.latitude,
        deliveryLongitude: destination!.longitude,
      })
      await clearCart()
      router.push('/manage/history')
    } catch {
      setError('Pesanan belum berhasil dibuat. Periksa koneksi lalu coba lagi.')
    } finally {
      setSubmitting(false)
    }
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
            <span className="text-muted">{item.name} x{item.qty}</span>
            <span className="font-medium">{formatCurrency(item.price * item.qty)}</span>
          </div>
        ))}

        <div className="border-t pt-4 flex justify-between font-bold text-lg">
          <span>Total ({totalQty} item)</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-5 space-y-3">
        <label className="block space-y-1 text-sm font-medium">
          Alamat pengantaran
          <textarea
            value={deliveryAddress}
            onChange={(event) => setDeliveryAddress(event.target.value)}
            maxLength={300}
            required
            placeholder="Contoh: Jl. Raya Rawa Indah No. 35, Bojong Pd. Terong, Cipayung, Depok"
            className="mt-1 min-h-24 w-full rounded-lg border border-[#DCD9D5] p-3 font-normal outline-none focus:border-[#BD6230]"
          />
        </label>
        <p className="text-sm text-muted">Klik titik rumah di map. Alamat membantu kurir menemukan detail tujuan.</p>
        <DestinationPicker value={destination} onChange={setDestination} />
        <p className="text-xs text-muted">{destination ? 'Titik tujuan dipilih.' : 'Belum memilih titik tujuan.'}</p>
        {error && (
          <p className="text-sm text-red-600" role="alert">{error}</p>
        )}
        <Button
          className="w-full"
          onClick={handleCheckout}
          disabled={submitting || !deliveryAddress.trim() || !destination}
        >
          {submitting ? 'Memproses...' : 'Buat Pesanan'}
        </Button>
      </div>
    </div>
  )
}

export default CheckoutPage
