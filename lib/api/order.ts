import apiClient from "@/lib/api";

export const getOrders = async (params: { page?: number; limit?: number }) => {
  const response = await apiClient.get('/transactions/store/orders', { params })
  return response.data
};

export const updateOrderStatus = async (id: string, status: 'IN_PROGRESS' | 'DELIVERED') => {
  const response = await apiClient.patch(`/transactions/${id}/status`, { status })
  return response.data
};
