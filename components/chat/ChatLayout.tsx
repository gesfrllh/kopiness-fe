'use client'

import { useState, useCallback, useEffect } from 'react'
import { useResponsiveStore } from '@/store/useResponsiveStore'
import ChatList from './ChatList'
import ChatWindow from './ChatWindow'
import { Icon } from '@iconify/react'

export default function ChatLayout() {
  const isMobile = useResponsiveStore((s) => s.isMobile)
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(undefined)
  const [showList, setShowList] = useState(true)

  useEffect(() => {
    if (!isMobile) {
      setShowList(true)
    }
  }, [isMobile])

  const handleSelectChat = useCallback((chatId: string) => {
    setSelectedChatId(chatId)
    if (isMobile) {
      setShowList(false)
    }
  }, [isMobile])

  const handleBack = useCallback(() => {
    setShowList(true)
    setSelectedChatId(undefined)
  }, [])

  return (
    <div className="flex h-[calc(100vh-12.5rem)] min-h-[540px] max-h-[760px] overflow-hidden rounded-[28px] border border-[#DCD9D5] bg-[#FBFAF9] shadow-[0_18px_50px_rgba(76,48,30,0.10)]">
      {/* List panel */}
      <div
        className={`
          ${isMobile ? (showList ? 'flex' : 'hidden') : 'flex'}
          w-full md:w-[320px] lg:w-[360px] flex-shrink-0 border-r border-[#DCD9D5]
          min-h-0 flex-col bg-[#FFFEFC]
        `}
      >
        <ChatList onSelectChat={handleSelectChat} selectedChatId={selectedChatId} />
      </div>

      {/* Chat panel */}
      <div
        className={`
          ${isMobile ? (!showList ? 'flex' : 'hidden') : 'flex'}
          min-h-0 flex-1 flex-col
          bg-[#F7F2EC]
        `}
      >
        {selectedChatId ? (
          <ChatWindow chatId={selectedChatId} onBack={isMobile ? handleBack : undefined} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#F1E4D6] text-[#8B542F]">
              <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full border-4 border-[#F7F2EC] bg-emerald-500" />
              <Icon icon="mdi:coffee-to-go-outline" width={36} />
            </div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#BD6230]">Kopiness inbox</p>
            <h3 className="mb-2 text-xl font-bold text-[#2D2D2D]">Pilih percakapan</h3>
            <p className="max-w-xs text-sm leading-6 text-[#7F7E77]">
              Buka chat dari panel kiri untuk melihat detail dan membalas pesan.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
