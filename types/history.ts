import { Product } from "./product"

export type statusPayment = 'PENDING' | 'PAID' | 'ACCEPTED' | 'REJECTED' | 'PREPARING' | 'HANDED_TO_COURIER' | 'ON_DELIVERY' | 'DELIVERED' | 'CANCELLED'

export interface PaymentHistory {
  id: string,
  invoice: string,
  amount: number,
  status: statusPayment,
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
  status: statusPayment,
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
  status: statusPayment,
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
  status: statusPayment;
  updatedAt: string;
  events?: TrackingEvent[];
}

export interface PaymentDetails {
  id: string,
  invoiceNumber: string,
  totalAmount: number,
  method: string,
  createdAt: string
  paidAt: string
}

export interface ItemsDetailsProduct {
  id: string,
  quantity: number,
  price: null | number,
  productId: string,
  transactionId: string,
  product: Product
}

export interface HistoryDetails extends Pick<HistoryResponseAdmin, 'orderNumber' | 'id' | 'status' | 'total' | 'createdAt'> {
  paymentId: string,
  payment: PaymentDetails
  items: ItemsDetailsProduct[]
  tracking: HistoryTracking
}

export interface StepsTracking {
  action: string;
  active: boolean;
  completed: boolean;
  label: string;
  step: number;
  timestamp: string | null;
}

export interface HistoryTracking extends Pick<HistoryResponseAdmin, 'orderNumber' | 'status'> {
  steps: StepsTracking[]
  progressPercent: number
  timeline: null
  courier?: { id: string; name: string } | null
  location?: { latitude: number; longitude: number; updatedAt: string } | null
  destination?: { address: string; latitude: number; longitude: number }
}

