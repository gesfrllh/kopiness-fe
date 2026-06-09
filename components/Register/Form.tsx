"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import FormGroup from '../Base/FormGroup'
import FormInput from '../Base/FormInput'
import Button from '../Base/Button'
import Link from 'next/link'
import Logo from '@/public/assets/logo.svg'
import { register } from '@/lib/api/auth'
import { showNotify } from '../Base/notification/notify-controllers'
import { useRouter } from 'next/navigation'
import { formatError } from '@/utils/formatError'
import AnimationLogin from '../animation/AnimationLogin'
import { RegisterInput } from '@/types/auth/user'

const Form = () => {
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState<RegisterInput>({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER'
  })

  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await register(form)

      if (response) {
        showNotify({
          type: "success",
          title: 'Sukses!',
          text: "User telah didaftarkan."
        })

        router.push('/login')
      }

    } catch (err: unknown) {
      showNotify({
        type: "error",
        title: 'Error!',
        text: `${formatError(err)}`
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='min-h-screen flex items-center justify-center bg-[#f2f3f5] px-4'>

      <div className="relative w-full max-w-md">

        <form
          onSubmit={handleRegister}
          className="bg-white p-8 rounded-xl shadow-md"
        >
          {/* Logo */}
          <div className='flex justify-center mb-6'>
            <Image
              src={Logo}
              alt='Kopiness Logo'
              width={96}
              priority
            />
          </div>

          {/* Form Fields */}
          <div className='space-y-5'>

            <FormGroup label='Name' required>
              <FormInput
                name='name'
                type='text'
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </FormGroup>

            <FormGroup label='Email' required>
              <FormInput
                name='email'
                type='email'
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </FormGroup>

            <FormGroup label='Password' required>
              <FormInput
                name='password'
                type='password'
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </FormGroup>

          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={
              !form.email ||
              !form.password ||
              !form.name
            }
            className='w-full mt-8'
          >
            Create Account
          </Button>

          {/* Footer */}
          <div className='mt-6 text-center text-sm text-gray-600'>
            Sudah punya akun?{" "}
            <Link
              href='/login'
              className='text-[#8b5e34] hover:underline'
            >
              Login
            </Link>
          </div>
        </form>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <AnimationLogin />
          </div>
        )}

      </div>
    </main>
  )
}

export default Form