export type TransactionStatus = 'PAID' | 'CANCELLED' | 'PENDING'

export interface userCashier {
  id: string,
  name: string,
  email: string
}

export interface itemsCashier {
  productId: string,
  productName: string,
  price: number,
  quantity: number,
  subtotal: number
}

export interface CashierResponse {
  id: string,
  status: TransactionStatus,
  createdAt: string,
  user: userCashier,
  items: itemsCashier[],
  totalItem: number,
  estimatedTotal: number
}