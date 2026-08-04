import apiClient from "@/lib/api";

export const getChats = async () => {
  const response = await apiClient.get('/chats')
  return response.data
};

export const getChatDetail = async (chatId: string) => {
  const response = await apiClient.get(`/chats/${chatId}`)
  return response.data
};

export const createChat = async (storeId: string) => {
  const response = await apiClient.post('/chats', { storeId })
  return response.data
};

export const sendMessage = async (chatId: string, content: string, replyToId?: string) => {
  const response = await apiClient.post(`/chats/${chatId}/messages`, { content, replyToId })
  return response.data
};

export const markAsRead = async (chatId: string, messageId: string) => {
  const response = await apiClient.patch(`/chats/${chatId}/messages/${messageId}/read`)
  return response.data
};

export const deleteChat = async (chatId: string) => {
  const response = await apiClient.delete(`/chats/${chatId}`)
  return response.data
};

export const broadcastTyping = async (chatId: string, isTyping: boolean) => {
  const response = await apiClient.post(`/chats/${chatId}/typing`, { isTyping })
  return response.data
};
