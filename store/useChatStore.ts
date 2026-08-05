import { create } from 'zustand'
import { ChatState, ChatListItemDto, ChatDetailDto, MessageResponseDto, MessageSenderDto } from '@/types/chat'
import { getChats, getChatDetail, createChat as createChatApi, sendMessage as sendMessageApi, markAsRead as markAsReadApi, deleteChat as deleteChatApi, broadcastTyping as broadcastTypingApi } from '@/lib/api/chat'
import { disconnectPusher, subscribeToChatChannel } from '@/lib/pusher'

let activeSubscriptions: { chatId: string; unsubscribe: () => void }[] = []
let realtimeUserId: string | null = null

export const useChatStore = create<ChatState>((set, get) => ({
  chatList: [],
  currentChat: null,
  messages: [],
  loading: false,
  sending: false,
  error: null,
  typingUsers: {},
  notifications: [],

  fetchChats: async () => {
    set({ loading: true, error: null })
    try {
      const data = await getChats()
      const list: ChatListItemDto[] = Array.isArray(data) ? data : []
      set((state) => {
        const notifications = [...state.notifications]

        list.forEach((chat) => {
          const previous = state.chatList.find((current) => current.id === chat.id)
          const isNewIncomingMessage =
            Boolean(previous?.lastMessage) &&
            previous?.lastMessage?.id !== chat.lastMessage?.id &&
            chat.lastMessage?.senderId !== realtimeUserId

          if (isNewIncomingMessage && chat.lastMessage && !notifications.some((notification) => notification.id === chat.lastMessage?.id)) {
            notifications.unshift({
              id: chat.lastMessage.id,
              chatId: chat.id,
              senderName: chat.lastMessage.sender.name,
              content: chat.lastMessage.content,
              createdAt: chat.lastMessage.createdAt,
            })
          }
        })

        return { chatList: list, notifications: notifications.slice(0, 20), loading: false }
      })
    } catch {
      set({ loading: false, error: 'Gagal memuat daftar chat' })
    }
  },

  fetchChatDetail: async (chatId: string) => {
    set({ loading: true, error: null })
    try {
      const data: ChatDetailDto = await getChatDetail(chatId)
      set((state) => ({
        currentChat: data,
        messages: data.messages ?? [],
        chatList: state.chatList.map((chat) =>
          chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
        ),
        notifications: state.notifications.filter((notification) => notification.chatId !== chatId),
        loading: false,
      }))
    } catch {
      set({ loading: false, error: 'Gagal memuat chat' })
    }
  },

  createChat: async (storeId: string) => {
    set({ loading: true, error: null })
    try {
      const data: ChatDetailDto = await createChatApi(storeId)
      set({ loading: false })
      return data
    } catch {
      set({ loading: false, error: 'Gagal membuat chat' })
      throw new Error('Gagal membuat chat')
    }
  },

  sendMessage: async (chatId: string, content: string, sender: MessageSenderDto, replyToId?: string) => {
    const temporaryId = `pending-${crypto.randomUUID()}`
    const temporaryMessage: MessageResponseDto = {
      id: temporaryId,
      chatId,
      senderId: sender.id,
      sender,
      content,
      replyTo: undefined,
      readAt: null,
      createdAt: new Date().toISOString(),
      deliveryStatus: 'sending',
    }

    set({ sending: true })
    set((state) => ({
      messages: state.currentChat?.id === chatId
        ? [...state.messages, temporaryMessage]
        : state.messages,
    }))

    try {
      const data: MessageResponseDto = await sendMessageApi(chatId, content, replyToId)
      set((state) => ({
        messages: state.messages.map((message) =>
          message.id === temporaryId ? { ...data, deliveryStatus: 'sent' } : message
        ),
        chatList: state.chatList.map((chat) =>
          chat.id === chatId ? { ...chat, lastMessage: data, updatedAt: data.createdAt } : chat
        ),
        sending: false,
      }))
    } catch {
      set((state) => ({
        messages: state.messages.map((message) =>
          message.id === temporaryId ? { ...message, deliveryStatus: 'failed' } : message
        ),
        sending: false,
      }))
      throw new Error('Gagal mengirim pesan')
    }
  },

  markAsRead: async (chatId: string, messageId: string) => {
    try {
      await markAsReadApi(chatId, messageId)
    } catch {
      // silent fallback
    }
  },

  deleteChat: async (chatId: string) => {
    set({ loading: true })
    try {
      await deleteChatApi(chatId)
      set((state) => ({
        chatList: state.chatList.filter((c) => c.id !== chatId),
        currentChat: state.currentChat?.id === chatId ? null : state.currentChat,
        messages: state.currentChat?.id === chatId ? [] : state.messages,
        loading: false,
      }))
    } catch {
      set({ loading: false })
      throw new Error('Gagal menghapus chat')
    }
  },

  setCurrentChat: (chat: ChatDetailDto | null) => {
    set({ currentChat: chat, messages: chat?.messages ?? [] })
  },

  setTyping: (chatId: string, isTyping: boolean) => {
    set((state) => ({
      typingUsers: { ...state.typingUsers, [chatId]: isTyping },
    }))
  },

  broadcastTyping: async (chatId: string, isTyping: boolean) => {
    try {
      await broadcastTypingApi(chatId, isTyping)
    } catch {
      // silent fallback
    }
  },

  subscribeToChannel: (chatId: string, userId: string) => {
    const existing = activeSubscriptions.find((s) => s.chatId === chatId)
    if (existing) return

    const { onNewMessage, onMessageRead, onTyping, unsubscribe } = subscribeToChatChannel(chatId, userId)

    onNewMessage((data: MessageResponseDto) => {
      const state = get()
       const isCurrentChat = state.currentChat?.id === chatId
       if (isCurrentChat && !state.messages.some((message) => message.id === data.id)) {
        set({ messages: [...state.messages, data] })
      }
      set({
        chatList: state.chatList.map((c) =>
          c.id === chatId
            ? { ...c, lastMessage: data, unreadCount: c.id === state.currentChat?.id ? 0 : c.unreadCount + 1 }
            : c
        ),
        notifications: isCurrentChat
          ? state.notifications
          : [{
            id: data.id,
            chatId,
            senderName: data.sender.name,
            content: data.content,
            createdAt: data.createdAt,
          }, ...state.notifications.filter((notification) => notification.id !== data.id)].slice(0, 20),
      })
    })

    onMessageRead((data: { id: string; chatId: string; readAt: string }) => {
      const state = get()
      if (state.currentChat?.id === data.chatId) {
        set({
          messages: state.messages.map((m) =>
            m.id === data.id ? { ...m, readAt: data.readAt } : m
          ),
        })
      }
    })

    onTyping((data) => {
      set((state) => ({
        typingUsers: { ...state.typingUsers, [data.chatId]: data.isTyping },
      }))
    })

    activeSubscriptions.push({ chatId, unsubscribe })
  },

  unsubscribeChannel: (chatId: string) => {
    const sub = activeSubscriptions.find((s) => s.chatId === chatId)
    if (sub) {
      sub.unsubscribe()
      activeSubscriptions = activeSubscriptions.filter((s) => s.chatId !== chatId)
    }
  },

  startRealtime: async (userId: string) => {
    if (realtimeUserId && realtimeUserId !== userId) {
      activeSubscriptions.forEach((subscription) => subscription.unsubscribe())
      activeSubscriptions = []
    }
    realtimeUserId = userId
    await get().fetchChats()
    get().chatList.forEach((chat) => get().subscribeToChannel(chat.id, userId))
  },

  stopRealtime: () => {
    activeSubscriptions.forEach((subscription) => subscription.unsubscribe())
    activeSubscriptions = []
    realtimeUserId = null
    disconnectPusher()
  },

  clearNotifications: () => set({ notifications: [] }),
}))
