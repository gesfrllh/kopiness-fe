import apiClient from "@/lib/api";
import { HistoryPayload } from "@/types/history";

export const getHistory = async (payload: HistoryPayload) => {
  const response = await apiClient.post('transactions/history', payload)
  return response.data
}