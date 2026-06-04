import apiClient from "@/lib/api";

export const UploadFileApi = async (formData: FormData) => {
  const response = await apiClient.post('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}
