'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'
import Button from '../Base/Button'
import apiClient from '@/lib/api'
import Link from 'next/link'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [linkData, setlinkData] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await apiClient.post('/auth/forgot-password', {
        email: email
      })
      setlinkData(res.data.data.resetLink)
      setLoading(false)
      setSent(true)
    } catch {
      setLoading(false)
    }

  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f2f3f5] px-4">

      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Forgot Password
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Masukkan email untuk menerima link reset password.
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-4 outline-none focus:border-[#8b5e34]"
              />
            </div>

            <Button
              type="submit"
              disabled={!email}
              variant='outline'
              className="w-full"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>

          </form>
        ) : (
          <div className="text-center text-sm text-gray-600">
            <p className="font-medium text-[#8b5e34]">
              Link berhasil dikirim ☕
            </p>
            <p className="mt-2">
              Klik <Link href={linkData} className='underline'>Disini</Link> Untuk melanjutkan Penggantian Password,
            </p>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          Sudah ingat password?{' '}
          <a href="/login" className="text-[#8b5e34] hover:underline">
            Login
          </a>
        </div>

      </div>
    </div>
  )
}