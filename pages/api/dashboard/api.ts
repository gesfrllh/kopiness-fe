import apiClient from "@/lib/api";

export const getDashboard = async () => {
  const response = await apiClient.get('dashboard/overview')
  return response.data
}