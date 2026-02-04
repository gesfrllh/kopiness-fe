'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import apiClient from '@/lib/api'
import Cookies from 'js-cookie'
import AnimationLogin from '../animation/AnimationLogin'

export default function OAuthSuccess() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    apiClient.get('/auth/me', { withCredentials: true })
      .then((res) => {
        setLoading(true)
        if (res.status === 200) {
          setLoading(false)
          const data = res.data.data

          const isLoggedin = data.isLoggedIn
          const role = data.user.role

          Cookies.set('status', res.status.toString())
          Cookies.set('is_logged_in', isLoggedin)
          Cookies.set('role', role)

          router.replace('/manage/dashboard')
        }
      })
      .catch(() => {
        router.replace('/login?error=oauth_failed')
        setLoading(false)
      })
  }, [])

  return (
    <>
      {loading ? <AnimationLogin /> : null}
    </>
  )
}
