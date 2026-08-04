import apiClient from "@/lib/api";
import { ProductRequest } from "@/types/product";

export const getProduct = async (params: { page: number; limit: number; store_id?: string }) => {
  const query: Record<string, string | number> = { page: params.page, limit: params.limit }
  if (params.store_id) query.store_id = params.store_id
  const response = await apiClient.get('/products', { params: query })
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

export const editProduct = async (id: string, product: Partial<ProductRequest>) => {
  const response = await apiClient.patch(`/products/${id}`, product)
  return response.data
}

export const deleteProduct = async (id: string) => {
  const response = await apiClient.delete(`/products/${id}`)
  return response.data
}

export const searchProducts = async (query: string) => {
  const response = await apiClient.get('/products', { params: { search: query, page: 1, limit: 10 } })
  return response.data
}
