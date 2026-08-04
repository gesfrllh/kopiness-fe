import apiClient from "@/lib/api";

export const getOrders = async (params: { page?: number; limit?: number }) => {
  const response = await apiClient.get('/transactions/store/orders', { params })
  return response.data
};

export type CourierOrder = {
  id: string
  orderNumber: string | null
  status: OrderStatus
  total: number
  createdAt: string
  store: { name: string; address: string | null; phone: string | null } | null
  createdBy: { name: string }
  items: { quantity: number; product: { name: string } }[]
}

export const getCourierOrders = async (): Promise<CourierOrder[]> => {
  const response = await apiClient.get('/transactions/courier/orders')
  return response.data?.data ?? response.data
}

import type { OrderStatus } from '@/types/order'

export const updateOrderStatus = async (id: string, status: OrderStatus) => {
  const response = await apiClient.patch(`/transactions/${id}/status`, { status })
  return response.data
};

export const updateCourierLocation = async (id: string, latitude: number, longitude: number) => {
  const response = await apiClient.patch(`/transactions/${id}/courier-location`, { latitude, longitude })
  return response.data
}

export const getCouriers = async () => {
  const response = await apiClient.get('/auth/couriers')
  return response.data
}

export const assignCourier = async (id: string, courierId: string) => {
  const response = await apiClient.patch(`/transactions/${id}/courier`, { courierId })
  return response.data
}
