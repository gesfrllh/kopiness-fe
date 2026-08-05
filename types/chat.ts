export interface MessageSenderDto {
  id: string;
  name: string;
  role: string;
}

export interface ReplyToDto {
  id: string;
  content: string;
  senderId: string;
}

export interface MessageResponseDto {
  id: string;
  chatId: string;
  senderId: string;
  sender: MessageSenderDto;
  content: string;
  replyTo?: ReplyToDto;
  readAt: string | null;
  createdAt: string;
  deliveryStatus?: 'sending' | 'sent' | 'failed';
}

export interface ChatListItemDto {
  id: string;
  storeId: string;
  storeName: string;
  storeLogo: string | null;
  customerId: string;
  customerName: string;
  lastMessage?: MessageResponseDto;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatDetailDto {
  id: string;
  storeId: string;
  storeName: string;
  storeLogo: string | null;
  customerId: string;
  customerName: string;
  messages: MessageResponseDto[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateChatPayload {
  storeId: string;
}

export interface SendMessagePayload {
  content: string;
  replyToId?: string;
}

export interface TypingEventDto {
  chatId: string;
  senderId: string;
  isTyping: boolean;
}

export interface ChatNotification {
  id: string;
  chatId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export interface ChatState {
  chatList: ChatListItemDto[];
  currentChat: ChatDetailDto | null;
  messages: MessageResponseDto[];
  loading: boolean;
  sending: boolean;
  error: string | null;
  typingUsers: Record<string, boolean>;
  notifications: ChatNotification[];

  fetchChats: () => Promise<void>;
  fetchChatDetail: (chatId: string) => Promise<void>;
  createChat: (storeId: string) => Promise<ChatDetailDto>;
  sendMessage: (chatId: string, content: string, sender: MessageSenderDto, replyToId?: string) => Promise<void>;
  markAsRead: (chatId: string, messageId: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  setCurrentChat: (chat: ChatDetailDto | null) => void;
  setTyping: (chatId: string, isTyping: boolean) => void;
  broadcastTyping: (chatId: string, isTyping: boolean) => Promise<void>;
  subscribeToChannel: (chatId: string, userId: string) => void;
  unsubscribeChannel: (chatId: string) => void;
  startRealtime: (userId: string) => Promise<void>;
  stopRealtime: () => void;
  clearNotifications: () => void;
}
