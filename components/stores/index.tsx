'use client'

import { useEffect } from 'react'
import { useStoresStore } from '@/store/useStoresStore'
import StoreCard from '@/components/stores/StoreCard'
import AnimationLogin from '@/components/animation/AnimationLogin'
import { PageContainer, PageHeader } from '@/components/Base/PageContainer'

const StoresPage = () => {
  const { stores, loading, fetchStores } = useStoresStore()

  useEffect(() => {
    fetchStores()
  }, [fetchStores])

  return (
    <PageContainer>
      <PageHeader
        title="Stores"
        subtitle="Pilih store tempat kamu ingin belanja"
      />

      {loading ? (
        <AnimationLogin />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}

export default StoresPage
