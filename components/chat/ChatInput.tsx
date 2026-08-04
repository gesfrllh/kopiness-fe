'use client'

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react'
import { Icon } from '@iconify/react'

interface ChatInputProps {
  onSend: (content: string) => Promise<void>
  sending: boolean
  onTyping?: (isTyping: boolean) => void
}

export default function ChatInput({ onSend, sending, onTyping }: ChatInputProps) {
  const [content, setContent] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const wasTypingRef = useRef(false)
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onTypingRef = useRef(onTyping)
  onTypingRef.current = onTyping

  const sendTyping = useCallback((isTyping: boolean) => {
    onTypingRef.current?.(isTyping)
  }, [])

  const stopTyping = useCallback(() => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current)
      typingTimerRef.current = null
    }
    if (wasTypingRef.current) {
      wasTypingRef.current = false
      sendTyping(false)
    }
  }, [sendTyping])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)

    if (!wasTypingRef.current) {
      wasTypingRef.current = true
      sendTyping(true)
    }

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current)
    }
    typingTimerRef.current = setTimeout(() => {
      wasTypingRef.current = false
      sendTyping(false)
    }, 300)
  }

  const handleSend = async () => {
    setContent('')
    const trimmed = content.trim()
    if (!trimmed || sending) return
    stopTyping()
    try {
      await onSend(trimmed)
      if (inputRef.current) {
        inputRef.current.style.height = 'auto'
      }

    } catch {
      // error handled by store
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px'
    }
  }

  useEffect(() => {
    return () => {
      stopTyping()
    }
  }, [stopTyping])

  return (
    <div className="flex-shrink-0 border-t border-[#E6DBD0] bg-[#FFFEFC] p-3 md:p-4">
      <div className="flex items-end gap-2 rounded-2xl border border-[#E4D8CE] bg-[#F9F5F1] p-2 focus-within:border-[#C2845D] focus-within:ring-4 focus-within:ring-[#C2845D]/10">
        <textarea
          ref={inputRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          onBlur={stopTyping}
          placeholder="Ketik pesan..."
          rows={1}
          className="max-h-[120px] flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-6 text-[#3B302A] outline-none placeholder:text-[#A28D7E]"
        />
        <button
          onClick={handleSend}
          disabled={!content.trim() || sending}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#8B542F] text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#754426] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {sending ? (
            <Icon icon="mdi:loading" width={20} className="animate-spin" />
          ) : (
            <Icon icon="mdi:send" width={20} />
          )}
        </button>
      </div>
      <p className="mt-1.5 hidden text-center text-[10px] text-[#A28D7E] md:block">
        Tekan Enter untuk mengirim, Shift+Enter untuk baris baru
      </p>
    </div>
  )
}
