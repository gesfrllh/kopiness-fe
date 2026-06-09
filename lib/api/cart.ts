import apiClient from "@/lib/api";

export const getCart = async () => {
  const response = await apiClient.get('/cart')
  return response.data
};

export const addCartItem = async (productId: string, quantity: number) => {
  const response = await apiClient.post('/cart/items', { productId, quantity })
  return response.data
};

export const updateCartItem = async (productId: string, quantity: number) => {
  const response = await apiClient.patch(`/cart/items/${productId}`, { quantity })
  return response.data
};

export const removeCartItem = async (productId: string) => {
  const response = await apiClient.delete(`/cart/items/${productId}`)
  return response.data
};

export const clearCartApi = async () => {
  const response = await apiClient.delete('/cart')
  return response.data
};
