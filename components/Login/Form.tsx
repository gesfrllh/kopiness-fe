"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { showNotify } from '../Base/notification/notify-controllers'
import { useAuthStore } from '@/store/useAuthStore'
import FormGroup from '../../components/Base/FormGroup'
import FormInput from '../../components/Base/FormInput'
import LoginLogo from '@/public/assets/login-logo.svg'
import Image from 'next/image'
import Logo from '@/public/assets/logo.svg'
import Button from '../Base/Button'
import Link from 'next/link'
import AnimationLogin from '../animation/AnimationLogin'
import { Icon } from '@iconify/react/dist/iconify.js'
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

  const handleWithGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google`;
  }

  return (
    <main className="grid md:grid-cols-2 min-h-screen items-center md:gap-12 bg-inside">
      <div className='h-full hidden relative md:flex flex-col items-center justify-center bg-colors-var shadow-lg'>
        <Image
          src={LoginLogo}
          alt=""
          width={320} />
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
          className="bg-colors-var p-8 rounded-lg shadow-lg w-full max-w-sm"
        >
          <div className='flex justify-center'>
            <Image
              src={Logo}
              alt='Logo'
              width={92} />
          </div>
          <div className='flex flex-col gap-4'>
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
          </div>
          <Button
            type="submit"
            disabled={!form.email || !form.password}
            className='w-full mt-8'>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          {loading ? <AnimationLogin /> : ''}
          <div className='flex flex-col gap-2 py-4 items-center'>
            <div className='flex gap-2'>
              Belum punya akun ?
              <Link href={'/registrations'} className='text-red-500'>Register</Link>
            </div>
            <div className="divider">
              <span>or</span>
            </div>
            <Button
              type="submit"
              variant='outline'
              className='w-full flex items-center justify-center gap-2'
              onClick={handleWithGoogle}>
              <Icon icon="material-icon-theme:google" width={28} />
              Sign up with Google
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
