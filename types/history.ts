export interface PaymentHistory {
  id: string,
  invoice: string,
  amount: number,
  status: 'PAID' | 'PENDING' | 'FAILED',
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
  status: 'PENDING' | 'CANCEL' | 'PAID',
  total: number,
  createdAt: string,
  paymentMethod: string,
  orderNumber?: string
  itemCount: number,
  customer: CustomerHistory,
  tracking?: TrackingInfo,
}

export interface HistoryResponseUser {
  id: string,
  status: 'PENDING' | 'CANCEL' | 'PAID',
  total: number,
  paymentMethod: string,
  itemCount: number
  invoiceNumber?: string
  orderNumber?: string
  createdAt: string
  tracking?: TrackingInfo,
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

export interface TrackingEvent {
  time: string;
  description: string;
}

export interface TrackingInfo {
  trackingId: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  updatedAt: string;
  events?: TrackingEvent[];
}