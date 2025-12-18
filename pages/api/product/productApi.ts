'use client'

import apiClient from "@/lib/api";
import { ProductRequest } from "@/types/product";

export const getProduct = async () => {
  const response  =  await apiClient.get('/products')
  return response.data
} 

export const getProductById = async (id: string) => {
  const response = await apiClient.get(`/products/${id}`)
  return response.data
}

export const addProduct = async (req: ProductRequest) => {
  const response = await apiClient.post<ProductRequest>('/products', req)
  return response.data
}

export const deleteProduct = async (id: string) => {
  const response = await apiClient.delete(`/products/${id}`)
  return response.data
}