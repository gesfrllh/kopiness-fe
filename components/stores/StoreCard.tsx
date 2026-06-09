'use client'

import { Store } from '@/types/store'
import { Icon } from '@iconify/react'
import Link from 'next/link'

interface Props {
  store: Store
}

const StoreCard = ({ store }: Props) => {
  return (
    <Link
      href={`/manage/stores/${store.slug}`}
      className="block bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-6 group"
    >
      <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
        <Icon icon="mdi:store" width={32} className="text-amber-900" />
      </div>

      <h3 className="font-bold text-lg mb-1 group-hover:text-amber-800 transition-colors">
        {store.name}
      </h3>

      <p className="text-sm text-muted flex items-start gap-1.5">
        <Icon icon="mdi:map-marker" width={16} className="shrink-0 mt-0.5" />
        {store.address}
      </p>
    </Link>
  )
}

export default StoreCard
