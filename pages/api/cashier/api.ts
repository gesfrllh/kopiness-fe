import apiClient from "@/lib/api";
// import { CashierResponse } from "@/types/cashier";

export const getCashier = async () => {
  const response = await apiClient.get('/transactions')
  return response.data
}