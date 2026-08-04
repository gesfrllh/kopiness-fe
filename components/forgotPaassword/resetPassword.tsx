"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Button from "../Base/Button"
import FormInput from "../Base/FormInput"
import FormGroup from "../Base/FormGroup"
import { showNotify } from "../Base/notification/notify-controllers"
import apiClient from "@/lib/api"
import { formatError } from "@/utils/formatError"

export default function ResetPassword() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const token = searchParams?.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!token) {
      showNotify({
        type: 'error',
        title: 'Error!',
        text: 'Invalid Reset Link'
      })
      setLoading(false)
      return
    }

    try {
      await apiClient.post('/auth/reset-password', {
        token: token,
        password: password
      })
      router.push("/login")
    } catch (err) {
      const message = formatError(err)
      showNotify({
        type: 'error',
        title: 'Error!',
        text: message
      })
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Invalid or expired reset link.</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f2f3f5] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">

        <h1 className="text-2xl font-semibold text-center mb-6">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <FormGroup label="New Password" required>
            <FormInput
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup>

          <FormGroup label="Confirm Password" required>
            <FormInput
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormGroup>
          <Button
            type="submit"
            disabled={!password || confirmPassword != password || loading}
            className="w-full"
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>

        </form>
      </div>
    </main>
  )
}
