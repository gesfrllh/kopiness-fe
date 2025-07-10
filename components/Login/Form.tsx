"use client"

import { useEffect, useState } from 'react'
import { formatError } from '@/utils/formatError'
import FormGroup from '../../components/Base/FormGroup'
import FormInput from '../../components/Base/FormInput'
import { useRouter } from 'next/navigation'
import LoginLogo from '@/public/assets/login-logo.svg'
import Image from 'next/image'
import Logo from '@/public/assets/logo.svg'
import Button from '../Base/Button'
import { showNotify } from '../Base/notification/notify-controllers'
import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'
import AnimationLogin from '../animation/AnimationLogin'
interface loginPage {
  email: string,
  password: string,
}

export default function LoginPage() {
  const [form, setForm] = useState<loginPage>({
    email: '',
    password: ''
  })

  const { login, loading, error } = useAuthStore()

  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    await login(form.email, form.password)
    if (!error) {
      showNotify({
        type: "success",
        title: 'Sukses!',
        text: "Login Berhasil!"
      })
      router.push('/manage/dashboard')
    }
  }

  useEffect(() => {
    if (error) {
      showNotify({
        type: 'error',
        title: 'Error!',
        text: error
      })
    }
  }, [error])

  return (
    <main className="grid grid-cols-2 min-h-screen items-center md:gap-12 bg-gray-100">
      <div className='h-full hidden md:flex flex-col items-center justify-center bg-white shadow-lg'>
        <Image src={LoginLogo} alt="" width={320} />
        <div className='p-8'>
          <h1 className='font-semibold '>Ngopi? Jangan nanggung!</h1>
          <p className='pt-4'>
            Bikin kopimu sendiri, tentuin ratio-nya, kayak lagi di balik mesin kopi.
            Lu yang nentuin — kita yang bikinin.
          </p>
          <p>
            Kopinya, gayanya, semuanya suka-suka lu.
          </p>
        </div>
      </div>
      <div className='h-screen items-center justify-center flex'>
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
        >
          <div className='flex justify-center'>
            <Image src={Logo} alt='Logo' width={92} />
          </div>
          <FormGroup label='Email' required={true}>
            <FormInput
              name='email'
              type='email'
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </FormGroup>
          <FormGroup label='Password' required={true}>
            <FormInput
              name='password'
              value={form.password}
              type='password'
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </FormGroup>
          <Button
            type="submit"
            disabled={!form.email || !form.password}
            className='w-full mt-8'>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          {loading ? <AnimationLogin /> : ''}
          <div className='flex gap-2 py-4 justify-end borderi'>
            Belum punya akun ?
            <Link href={'/registrations'} className='text-red-500'>Register</Link>
          </div>
        </form>
      </div>
    </main>
  )
}
