export interface PaymentHistory {
  id: string,
  invoice: string,
  amount: number,
  status: 'SUCCESS' | 'PENDING' | 'FAILED',
  createdAt: string,
  paymentMethod: string
}

export interface CustomerHistory {
  id: string,
  name: string,
  email: string
}

export interface HistoryResponseAdmin {
  id: string,
  invoiceNumber?: string,
  status: 'PENDING' | 'CANCEL' | 'SUCCESS',
  total: number,
  createdAt: string,
  paymentMethod: string,
  orderNumber?: string
  itemCount: number,
  customer: CustomerHistory,
}

export interface HistoryResponseUser {
  id: string,
  status: 'PENDING' | 'CANCEL' | 'SUCCESS',
  total: number,
  paymentMethod: string,
  itemCount: number
  invoiceNumber?: string
  orderNumber?: string
  createdAt: string
}

export interface HistoryPayload {
  page?: number,
  limit?: number,
  search?: string,
  status?: string,
  method?: string,
  userId?: string,
  startDate?: string,
  endDate?: string
}