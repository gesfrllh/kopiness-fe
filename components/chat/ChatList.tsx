'use client'

import { useEffect } from 'react'
import { useChatStore } from '@/store/useChatStore'
import { useAuthStore } from '@/store/useAuthStore'
import { Icon } from '@iconify/react'
import { formatDate } from '@/utils/general'

interface ChatListProps {
  onSelectChat: (chatId: string) => void
  selectedChatId?: string
}

export default function ChatList({ onSelectChat, selectedChatId }: ChatListProps) {
  const { chatList, loading, fetchChats } = useChatStore()
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    fetchChats()
  }, [fetchChats])

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-[#E6DBD0] px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#BD6230]">Customer care</p>
            <h2 className="mt-1 text-lg font-bold text-[#2D2D2D]">Percakapan</h2>
          </div>
          <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-[#F3E7DB] px-2 text-xs font-bold text-[#8B542F]">
            {chatList.length}
          </span>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#F7F2EC] px-3 py-2 text-xs text-[#8D7563]">
          <Icon icon="mdi:magnify" width={16} />
          Cari percakapan
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && chatList.length === 0 ? (
            <div className="flex h-32 items-center justify-center">
              <Icon icon="mdi:loading" width={24} className="animate-spin text-[#BD6230]" />
          </div>
        ) : chatList.length === 0 ? (
            <div className="flex h-44 flex-col items-center justify-center px-6 text-center">
              <div className="mb-3 rounded-2xl bg-[#F3E7DB] p-3 text-[#9B6038]">
                <Icon icon="mdi:message-text-outline" width={24} />
              </div>
              <p className="text-sm font-semibold text-[#554238]">Belum ada percakapan</p>
              <p className="mt-1 text-xs leading-5 text-[#8D7563]">Chat pelanggan akan muncul di sini.</p>
          </div>
        ) : (
          chatList.map((chat) => {
            const isSelected = chat.id === selectedChatId
            const isStoreOwner = user?.role === 'STOREOWNER' || user?.role === 'SUPERADMIN'
            const displayName = isStoreOwner ? chat.customerName : chat.storeName

            return (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`
                  w-full text-left px-5 py-4 flex items-start gap-3 border-b border-[#F0E8E1]
                  transition-all duration-200
                  ${isSelected
                    ? 'bg-[#F7EDE4] shadow-[inset_3px_0_0_#BD6230]'
                    : 'hover:bg-[#FCF8F4]'
                  }
                `}
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#EEDDCF] text-sm font-bold text-[#8B542F]">
                  {displayName.slice(0, 1).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                      <span className="truncate text-sm font-bold text-[#3B302A]">
                      {displayName}
                    </span>
                    {chat.lastMessage && (
                      <span className="ml-2 flex-shrink-0 text-[10px] text-[#9A8373]">
                        {formatDate(chat.lastMessage.createdAt, 'time')}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 truncate text-xs text-[#806B5D]">
                    {chat.lastMessage?.content ?? 'Belum ada pesan'}
                  </p>
                </div>

                {chat.unreadCount > 0 && (
                  <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#BD6230] text-[10px] font-bold text-white shadow-sm">
                    {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                  </div>
                )}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
