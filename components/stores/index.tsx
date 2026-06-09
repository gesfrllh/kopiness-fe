'use client'

import { useEffect } from 'react'
import { Icon } from '@iconify/react'
import { useStoresStore } from '@/store/useStoresStore'
import StoreCard from '@/components/stores/StoreCard'
import CTA from '@/components/Base/cta'
import AnimationLogin from '@/components/animation/AnimationLogin'
import Button from '@/components/Base/Button'

const StoresPage = () => {
  const { stores, loading, fetchStores } = useStoresStore()

  useEffect(() => {
    fetchStores()
  }, [fetchStores])

  return (
    <div className="space-y-6">
      <CTA
        title="Pilih Store"
        subtitle="Tentukan store tempat kamu ingin belanja"
        size="md"
        variant="gradient"
        icon={<Icon icon="mdi:store-search" width={24} />}
        rightSlot={
          <Button
            className="bg-white text-amber-900 hover:bg-amber-50"
          >
            Tambah Store
          </Button>
        }
      />

      {loading ? (
        <AnimationLogin />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      )}
    </div>
  )
}

export default StoresPage
