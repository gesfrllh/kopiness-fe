import apiClient from "@/lib/api";

export const UploadFileApi = async (file: FormData) => {
  const response = await apiClient.post('/file/upload', file)
  return response.data
}