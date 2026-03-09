import apiClient from "@/lib/api";
import { HistoryPayload } from "@/types/history";

export const getHistory = async (payload: HistoryPayload) => {
  const response = await apiClient.post('transactions/history', payload)
  return response.data
}

export const getDetail = async (id: string) => {
  const response = await apiClient.get(`transactions/${id}`)
  return response.data
}

export const getDetailsTracking = async (id: string) => {
  const response = await apiClient.get(`transactions/${id}/tracking`)
  return response.data
}