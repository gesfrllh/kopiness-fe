'use client'

import { MessageResponseDto } from '@/types/chat'
import { formatDate } from '@/utils/general'
import { Icon } from '@iconify/react'

interface ChatMessageProps {
  message: MessageResponseDto
  isOwn: boolean
}

export default function ChatMessage({ message, isOwn }: ChatMessageProps) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className="max-w-[85%] sm:max-w-[76%]">
        {!isOwn && (
          <p className="mb-1 px-1 text-xs font-semibold text-[#7A6251]">
            {message.sender.name}
          </p>
        )}
        <div
          className={`
            rounded-2xl px-4 py-3 break-words shadow-sm
            ${isOwn
              ? 'bg-[#8B542F] text-white rounded-br-md shadow-[#8B542F]/20'
              : 'border border-[#E7DDD5] bg-[#FFFEFC] text-[#3B302A] rounded-bl-md'
            }
          `}
        >
          {message.replyTo && (
            <div className={`mb-2 rounded-lg px-2.5 py-1.5 text-xs ${isOwn ? 'bg-white/15' : 'bg-[#F6EEE7] text-[#725C4D]'}`}>
              <span className="font-medium opacity-70">Balasan ke: </span>
              <span className="opacity-60 line-clamp-1">{message.replyTo.content}</span>
            </div>
          )}
          <p className="text-sm leading-6">{message.content}</p>
        </div>
        <div className={`flex items-center gap-1 mt-0.5 ${isOwn ? 'justify-end' : 'justify-start'} px-1`}>
          <span className="text-[10px] text-[#9A8373]">
            {formatDate(message.createdAt, 'time')}
          </span>
          {isOwn && (
            <Icon
              icon={
                message.deliveryStatus === 'sending'
                  ? 'mdi:clock-outline'
                  : message.deliveryStatus === 'failed'
                    ? 'mdi:alert-circle-outline'
                    : message.readAt
                      ? 'mdi:check-all'
                      : 'mdi:check'
              }
              width={14}
              className={
                message.deliveryStatus === 'failed'
                  ? 'text-red-300'
                  : message.readAt
                    ? 'text-sky-500'
                    : 'text-[#9A8373]'
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}
