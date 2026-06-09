import apiClient from "@/lib/api";

export const getStores = async () => {
  const response = await apiClient.get('/stores')
  return response.data
};

export const getStoreBySlug = async (slug: string) => {
  const response = await apiClient.get(`/stores/${slug}`)
  return response.data
};
