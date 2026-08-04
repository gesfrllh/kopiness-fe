'use client'

import { useEffect, useRef, useState } from 'react'
import Button from '@/components/Base/Button'
import { Card, PageContainer, PageHeader } from '@/components/Base/PageContainer'
import { getCourierOrders, type CourierOrder, updateCourierLocation, updateOrderStatus } from '@/lib/api/order'
import { formatCurrency } from '@/utils/general'
import { formatError } from '@/utils/formatError'
import { showNotify } from '@/components/Base/notification/notify-controllers'

const statusLabel = {
  HANDED_TO_COURIER: 'Siap diambil',
  ON_DELIVERY: 'Sedang diantar',
} as const

export default function CourierOrders() {
  const [orders, setOrders] = useState<CourierOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const watches = useRef(new Map<string, number>())

  const stopLocationWatch = (orderId: string) => {
    const watchId = watches.current.get(orderId)
    if (watchId !== undefined) {
      navigator.geolocation.clearWatch(watchId)
      watches.current.delete(orderId)
    }
  }

  const startLocationWatch = (orderId: string) => {
    if (!navigator.geolocation || watches.current.has(orderId)) return

    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => { void updateCourierLocation(orderId, coords.latitude, coords.longitude) },
      () => showNotify({ type: 'error', title: 'Lokasi tidak tersedia', text: 'Izinkan lokasi browser untuk melacak pengantaran.' }),
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 15_000 },
    )
    watches.current.set(orderId, watchId)
  }

  const loadOrders = async () => {
    setLoading(true)
    try {
      const nextOrders = await getCourierOrders()
      setOrders(nextOrders)
      nextOrders
        .filter((order) => order.status === 'ON_DELIVERY')
        .forEach((order) => startLocationWatch(order.id))
    } catch (error) {
      showNotify({ type: 'error', title: 'Gagal memuat tugas', text: formatError(error) })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadOrders()
    return () => watches.current.forEach((watchId) => navigator.geolocation.clearWatch(watchId))
  }, [])

  const updateStatus = async (order: CourierOrder) => {
    const status = order.status === 'HANDED_TO_COURIER' ? 'ON_DELIVERY' : 'DELIVERED'
    setUpdating(order.id)
    try {
      await updateOrderStatus(order.id, status)
      if (status === 'ON_DELIVERY') startLocationWatch(order.id)
      if (status === 'DELIVERED') stopLocationWatch(order.id)
      showNotify({ type: 'success', title: 'Status diperbarui', text: status === 'ON_DELIVERY' ? 'Pengantaran dimulai.' : 'Pesanan terkirim.' })
      await loadOrders()
    } catch (error) {
      showNotify({ type: 'error', title: 'Gagal memperbarui status', text: formatError(error) })
    } finally {
      setUpdating(null)
    }
  }

  return (
    <PageContainer>
      <PageHeader title="Tugas Pengantaran" subtitle="Ambil pesanan, mulai antar, lalu konfirmasi terkirim." />
      <div className="grid gap-4">
        {loading && <Card>Memuat tugas...</Card>}
        {!loading && orders.length === 0 && <Card>Belum ada pesanan yang ditugaskan.</Card>}
        {orders.map((order) => (
          <Card key={order.id}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="font-semibold text-[#5A2D0C]">{order.orderNumber ?? order.id}</p>
                <p className="text-sm text-[#2D2D2D]">{order.store?.name ?? 'Store'} ke {order.createdBy.name}</p>
                <p className="text-sm text-[#7F7E77]">{order.store?.address ?? 'Alamat store belum tersedia'}</p>
                <p className="text-sm text-[#7F7E77]">{order.items.map((item) => `${item.quantity}x ${item.product.name}`).join(', ')}</p>
                <p className="text-sm font-medium">{formatCurrency(order.total)}</p>
              </div>
              <div className="flex flex-col items-start gap-2 md:items-end">
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{statusLabel[order.status as keyof typeof statusLabel]}</span>
                <Button onClick={() => void updateStatus(order)} disabled={updating === order.id}>
                  {updating === order.id ? 'Memperbarui...' : order.status === 'HANDED_TO_COURIER' ? 'Mulai Antar' : 'Pesanan Terkirim'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  )
}
