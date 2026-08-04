'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useChatStore } from '@/store/useChatStore'

export default function ChatRealtimeInit() {
  const userId = useAuthStore((state) => state.user?.id)

  useEffect(() => {
    if (userId) {
      void useChatStore.getState().startRealtime(userId)

      // Pusher is the primary channel; polling keeps unread state correct on networks that block websockets.
      const interval = window.setInterval(() => {
        void useChatStore.getState().startRealtime(userId)
      }, 15_000)

      return () => {
        window.clearInterval(interval)
        useChatStore.getState().stopRealtime()
      }
    }
  }, [userId])

  return null
}
