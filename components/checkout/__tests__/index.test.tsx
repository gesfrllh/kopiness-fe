'use client'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CheckoutPage from '@/components/checkout'
import { useCartStore } from '@/store/useCartStore'
import { createTransaction } from '@/lib/api/cashier'

const push = vi.fn()

vi.mock('@/components/map/DestinationPicker', () => ({
  default: ({ onChange }: { onChange: (value: { latitude: number; longitude: number }) => void }) => (
    <button type="button" onClick={() => onChange({ latitude: -6.2, longitude: 106.8 })}>Pilih tujuan</button>
  ),
}))

vi.mock('@/lib/api/cashier', () => ({ createTransaction: vi.fn() }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }))
vi.mock('next/dynamic', () => ({ default: () => ({ onChange }: { onChange: (value: { latitude: number; longitude: number }) => void }) => (
  <button type="button" onClick={() => onChange({ latitude: -6.2, longitude: 106.8 })}>Pilih tujuan</button>
) }))

describe('CheckoutPage', () => {
  const clearCart = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    useCartStore.setState({
      items: [{
        id: 'coffee-1',
        name: 'Kopi',
        price: 25000,
        qty: 2,
        imageUrl: [],
        stock: 10,
        origin: '',
        process: '',
        flavorNotes: '',
        roastLevel: 'MEDIUM',
        secTitle: '',
        description: '',
      }],
      totalQty: 2,
      clearCart,
    })
  })

  it('submits order then clears cart and redirects', async () => {
    vi.mocked(createTransaction).mockResolvedValue({})
    clearCart.mockResolvedValue(undefined)
    render(<CheckoutPage />)

    fireEvent.change(screen.getByLabelText('Alamat pengantaran'), { target: { value: ' Jalan Kopi 1 ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Pilih tujuan' }))
    fireEvent.click(screen.getByRole('button', { name: 'Buat Pesanan' }))

    await waitFor(() => expect(createTransaction).toHaveBeenCalledWith({
      items: [{ productId: 'coffee-1', quantity: 2 }],
      deliveryAddress: 'Jalan Kopi 1',
      deliveryLatitude: -6.2,
      deliveryLongitude: 106.8,
    }))
    expect(clearCart).toHaveBeenCalledOnce()
    expect(push).toHaveBeenCalledWith('/manage/history')
  })

  it('keeps cart and shows error when order API fails', async () => {
    vi.mocked(createTransaction).mockRejectedValue(new Error('Network error'))
    render(<CheckoutPage />)

    fireEvent.change(screen.getByLabelText('Alamat pengantaran'), { target: { value: 'Jalan Kopi 1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Pilih tujuan' }))
    fireEvent.click(screen.getByRole('button', { name: 'Buat Pesanan' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Pesanan belum berhasil dibuat')
    expect(clearCart).not.toHaveBeenCalled()
    expect(push).not.toHaveBeenCalled()
  })
})
