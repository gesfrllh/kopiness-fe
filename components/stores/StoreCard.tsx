'use client'

import { Store } from '@/types/store'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { useChatStore } from '@/store/useChatStore'
import { showNotify } from '@/components/Base/notification/notify-controllers'
import { Card } from '@/components/Base/PageContainer'

interface Props {
  store: Store
}

const StoreCard = ({ store }: Props) => {
  const router = useRouter()
  const role = Cookies.get('role')
  const { createChat } = useChatStore()
  const isCustomer = role === 'CUSTOMER'

  const handleChat = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await createChat(store.id)
      router.push('/manage/chat')
    } catch {
      showNotify({ type: 'error', title: 'Gagal', text: 'Gagal memulai chat' })
    }
  }

  return (
    <Card className="hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#BD6230]/10 to-[#8B4513]/10 flex items-center justify-center group-hover:from-[#BD6230]/20 group-hover:to-[#8B4513]/20 transition-all">
          <Icon icon="mdi:store" width={28} className="text-[#BD6230]" />
        </div>
        <Icon icon="pepicons-pop:dots-y" width={24} className="text-[#7F7E77] opacity-50" />
      </div>

      <h3 className="font-semibold text-lg text-[#2D2D2D] mb-1 group-hover:text-[#BD6230] transition-colors">
        {store.name}
      </h3>
      <p className="text-sm text-[#7F7E77] flex items-start gap-1.5 mb-4">
        <Icon icon="mdi:map-marker" width={16} className="shrink-0 mt-0.5" />
        {store.address}
      </p>

      <div className="flex flex-col gap-2">
        {isCustomer && (
          <button
            onClick={handleChat}
            className="w-full py-2 rounded-lg bg-[#BD6230] text-white text-sm font-medium hover:bg-[#A0522D] transition-all flex items-center justify-center gap-2"
          >
            <Icon icon="mdi:chat-outline" width={16} />
            Chat
          </button>
        )}
        <Link
          href={`/manage/stores/${store.slug}`}
          className="w-full py-2 rounded-lg border border-[#DCD9D5] text-[#2D2D2D] text-sm font-medium hover:bg-[rgba(189,98,48,0.06)] hover:border-[#BD6230]/30 transition-all flex items-center justify-center gap-2"
        >
          Lihat Produk
          <Icon icon="ic:round-arrow-right" width={20} />
        </Link>
      </div>
    </Card>
  )
}

export default StoreCard
