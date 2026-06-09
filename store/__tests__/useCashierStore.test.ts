import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useCashierStore } from '@/store/useCashierStore'

vi.mock('@/lib/api/cashier', () => ({
  getCashier: vi.fn(),
  getPaymentType: vi.fn(),
  deleteProduct: vi.fn(),
  payment: vi.fn(),
}))

import { getCashier, getPaymentType, deleteProduct, payment } from '@/lib/api/cashier'

describe('useCashierStore', () => {
  beforeEach(() => {
    useCashierStore.setState({
      Cashier: [],
      paymentList: [],
      loading: false,
      error: '',
      selected: [],
      deleted: null,
      openModal: false,
      choosePayment: false,
      selectedPayment: undefined,
    })
    vi.clearAllMocks()
  })

  it('initial state', () => {
    const state = useCashierStore.getState()
    expect(state.Cashier).toEqual([])
    expect(state.selected).toEqual([])
    expect(state.openModal).toBe(false)
  })

  it('setSelected updates selected items', () => {
    const items = [{ id: '1', title: 'Item', content: 'Content', subTotal: 10000 }]
    useCashierStore.getState().setSelected(items)
    expect(useCashierStore.getState().selected).toEqual(items)
  })

  it('resetUI resets UI state', () => {
    useCashierStore.getState().setSelected([{ id: '1', title: 'Item', content: 'Content', subTotal: 10000 }])
    useCashierStore.getState().setOpenModal(true)
    useCashierStore.getState().setChoosePayment(true)

    useCashierStore.getState().resetUI()

    expect(useCashierStore.getState().selected).toEqual([])
    expect(useCashierStore.getState().openModal).toBe(false)
    expect(useCashierStore.getState().choosePayment).toBe(false)
  })

  it('getCashier loads data on success', async () => {
    const mockData = [{ id: '1', transactionCode: 'TRX-001', transactionDate: '2026-06-09', status: 'PENDING', userName: 'Budi', items: [], totalPayment: 50000 }]
    vi.mocked(getCashier).mockResolvedValue(mockData)

    await useCashierStore.getState().getCashier()

    expect(useCashierStore.getState().Cashier).toEqual(mockData)
    expect(useCashierStore.getState().loading).toBe(false)
  })

  it('getCashier throws on error', async () => {
    vi.mocked(getCashier).mockRejectedValue(new Error('Failed'))

    await expect(useCashierStore.getState().getCashier()).rejects.toThrow()
    expect(useCashierStore.getState().loading).toBe(false)
  })

  it('getPayment loads payment methods', async () => {
    const methods = [{ id: '1', name: 'Cash', type: 'CASH' }]
    vi.mocked(getPaymentType).mockResolvedValue({ methods })

    await useCashierStore.getState().getPayment()

    expect(useCashierStore.getState().paymentList).toEqual(methods)
  })

  it('removeProduct cancels and refreshes', async () => {
    vi.mocked(deleteProduct).mockResolvedValue(undefined)
    vi.mocked(getCashier).mockResolvedValue([])

    await useCashierStore.getState().removeProduct('prod-1')

    expect(deleteProduct).toHaveBeenCalledWith('prod-1')
    expect(useCashierStore.getState().loading).toBe(false)
  })
})
