import apiClient from "@/lib/api";
import { AdjustCoffePayload, CoffePayload } from "@/types/coffee";

export const getOptions = async () => {
  const response = await apiClient.get('coffee-assistant/options')
  return response.data
}

export const generateData = async (payload: CoffePayload) => {
  const response = await apiClient.post('coffee-assistant/generate', payload)
  return response.data
}

export const adjustData = async (payload: AdjustCoffePayload) => {
  const response = await apiClient.post('ai/coffe-assistant', payload)
  return response.data
} 