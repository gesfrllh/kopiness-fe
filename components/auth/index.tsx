'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import apiClient from '@/lib/api'
import Cookies from 'js-cookie'

export default function OAuthSuccess() {
  const router = useRouter()

  useEffect(() => {

    apiClient.get('/auth/me', { withCredentials: true })
      .then((res) => {
        if (res.data.isLoggedIn) {
          const login = res.data.isLoggedin
          Cookies.set('is_logged_in', login)
        }
        router.replace('/manage/dashboard')
      })
      .catch(() => {
        router.replace('/login?error=oauth_failed')
      })
  }, [])

  return <p>Signing you in…</p>
}
