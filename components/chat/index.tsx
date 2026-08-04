'use client'

import ChatLayout from './ChatLayout'
import { PageContainer, PageHeader } from '@/components/Base/PageContainer'

export default function ChatPage() {
  return (
    <PageContainer className="chat-workspace">
      <PageHeader
        title="Inbox"
        subtitle="Kelola percakapan pelanggan dan store dalam satu tempat."
        action={
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#DCD9D5] bg-[#FBFAF9] px-3 py-1.5 text-xs font-medium text-[#7F7E77]">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Pesan real-time
          </div>
        }
      />
      <ChatLayout />
    </PageContainer>
  )
}
