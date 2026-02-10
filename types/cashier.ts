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
  subtotal: number,
  stock: number,
}

export interface CashierResponse {
  id: string,
  status: TransactionStatus,
  orderNumber: string,
  createdAt: string,
  user: userCashier,
  items: itemsCashier[],
  totalItem: number,
  estimatedTotal: number
}

export interface PaymentListResponse {
  id: string,
  name: string,
  logoUrl: string,
}