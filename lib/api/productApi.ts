import apiClient from "@/lib/api";
import { ProductRequest } from "@/types/product";

export const getProduct = async (params: { page: number; limit: number }) => {
  const response = await apiClient.get('/products', { params })
  return response.data
}

export const getProductById = async (id: string) => {
  const response = await apiClient.get(`/products/${id}`)
  return response.data
}

export const addProduct = async (product: ProductRequest) => {
  const response = await apiClient.post('/products', product)
  return response.data
}

export const editProduct = async (id: string, product: ProductRequest) => {
  const response = await apiClient.put(`/products/${id}`, product)
  return response.data
}

export const deleteProduct = async (id: string) => {
  const response = await apiClient.delete(`/products/${id}`)
  return response.data
}

export const confirmCart = async (payload: { items: Array<{ productId: string; quantity: number }> }) => {
  const response = await apiClient.post('/products/confirm-cart', payload)
  return response.data
}
