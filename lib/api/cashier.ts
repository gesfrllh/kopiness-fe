import apiClient from "@/lib/api";
import { PaymentListRequest } from "@/types/cashier";
// import { CashierResponse } from "@/types/cashier";

export const getCashier = async () => {
  const response = await apiClient.get('/transactions')
  return response.data
}

export const deleteProduct = async (id: string) => {
  const response = await apiClient.post(`/transactions/${id}/cancel`)
  return response.data
}

export const payment = async (payload: PaymentListRequest) => {
  const response = await apiClient.post<PaymentListRequest>(`/transactions/payment`, payload)
  return response.data
}

export const getPaymentType = async () => {
  const response = await apiClient.get('/payment-methods')
  return response.data
}

export const createTransaction = async (payload: { items: Array<{ productId: string; quantity: number }> }) => {
  const response = await apiClient.post('/transactions', payload)
  return response.data
}
