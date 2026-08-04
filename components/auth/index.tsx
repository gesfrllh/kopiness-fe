'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { homeForRole } from '@/lib/auth/routes'
import AnimationLogin from '../animation/AnimationLogin'

export default function OAuthSuccess() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    setLoading(true)
    void useAuthStore.getState().hydrate().then(() => {
      const role = useAuthStore.getState().role
      if (role === 'SUPERADMIN' || role === 'STOREOWNER' || role === 'COURIER' || role === 'CUSTOMER') {
        router.replace(homeForRole(role))
      } else {
        router.replace('/login?error=oauth_failed')
      }
      setLoading(false)
    })
  }, [router])

  return (
    <>
      {loading ? <AnimationLogin /> : null}
    </>
  )
}
