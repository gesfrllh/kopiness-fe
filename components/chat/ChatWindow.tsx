'use client'

import { useEffect, useRef } from 'react'
import { useChatStore } from '@/store/useChatStore'
import { useAuthStore } from '@/store/useAuthStore'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import { Icon } from '@iconify/react'

interface ChatWindowProps {
  chatId: string
  onBack?: () => void
}

export default function ChatWindow({ chatId, onBack }: ChatWindowProps) {
  const {
    currentChat,
    messages,
    loading,
    sending,
    typingUsers,
    fetchChatDetail,
    sendMessage,
    markAsRead,
    broadcastTyping,
    subscribeToChannel,
  } = useChatStore()

  const user = useAuthStore((s) => s.user)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatId) {
      fetchChatDetail(chatId)
    }
  }, [chatId, fetchChatDetail])

  useEffect(() => {
    if (chatId && user?.id) {
      subscribeToChannel(chatId, user.id)
    }
  }, [chatId, user?.id, subscribeToChannel])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (messages.length > 0 && user?.id) {
      const unreadOwn = messages.filter(
        (m) => m.senderId !== user.id && !m.readAt
      )
      unreadOwn.forEach((m) => {
        markAsRead(chatId, m.id).catch(() => { })
      })
    }
  }, [messages, chatId, user?.id, markAsRead])

  const handleSend = async (content: string) => {
    if (!user) return

    await sendMessage(chatId, content, {
      id: user.id,
      name: user.name,
      role: user.role ?? 'CUSTOMER',
    })
  }

  const handleTyping = (isTyping: boolean) => {
    broadcastTyping(chatId, isTyping)
  }

  if (loading && !currentChat) {
    return (
      <div className="flex items-center justify-center h-full">
        <Icon icon="mdi:loading" width={32} className="animate-spin theme-text opacity-50" />
      </div>
    )
  }

  if (!currentChat) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <Icon icon="mdi:chat-outline" width={48} className="theme-text opacity-20 mb-3" />
        <p className="text-sm theme-text opacity-50">Pilih percakapan untuk mulai chatting</p>
      </div>
    )
  }

  const isStoreOwner = user?.role === 'STOREOWNER' || user?.role === 'SUPERADMIN'
  const chatPartnerName = isStoreOwner ? currentChat.customerName : currentChat.storeName

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="flex flex-shrink-0 items-center gap-3 border-b border-[#E6DBD0] bg-[#FFFEFC] px-4 py-3.5 md:px-5">
        {onBack && (
          <button onClick={onBack} className="-ml-1 rounded-xl p-2 text-[#6E5849] transition-colors hover:bg-[#F3E7DB] md:hidden" aria-label="Kembali ke daftar chat">
            <Icon icon="mdi:arrow-left" width={20} />
          </button>
        )}
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-[#EEDDCF] text-sm font-bold text-[#8B542F]">
          {chatPartnerName.slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-[#3B302A]">{chatPartnerName}</h3>
          <p className="mt-0.5 text-[11px] text-[#8D7563]">{messages.length} pesan dalam percakapan ini</p>
        </div>
        <div className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Aktif
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="rounded-full bg-white/70 px-4 py-2 text-sm text-[#8D7563] shadow-sm">Belum ada pesan. Mulai percakapan pertama.</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                isOwn={msg.senderId === user?.id}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}

        {typingUsers[chatId] && (
          <div className="mt-3 flex items-center gap-2 px-1 py-2">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-xs text-[#8D7563]">Sedang mengetik...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} onTyping={handleTyping} sending={sending} />
    </div>
  )
}
