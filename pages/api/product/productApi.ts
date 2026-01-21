'use client'

import apiClient from "@/lib/api";
import { ProductRequest } from "@/types/product";

interface ParamsGetProduct {
  page: number,
  limit: number
}

export const getProduct = async (params: ParamsGetProduct) => {
  const response  =  await apiClient.get('/products', {params})
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

export const editProduct = async (id: string, req: ProductRequest) => {
  const response = await apiClient.patch<ProductRequest>(`/products/${id}`, req)
  return response.data
}

export const deleteProduct = async (id: string) => {
  const response = await apiClient.delete(`/products/${id}`)
  return response.data
}