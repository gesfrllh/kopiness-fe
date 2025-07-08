"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import FormGroup from '../Base/FormGroup'
import FormInput from '../Base/FormInput'
import Button from '../Base/Button'
import Link from 'next/link'
import Logo from '@/public/assets/logo.svg'
import Select from '../Base/Select'
import { register } from '@/app/hooks/useRegister'
import { showNotify } from '../Base/notification/notify-controllers'
import router from 'next/router'
import { formatError } from '@/utils/formatError'

interface RegisterInput {
  name: string,
  email: string,
  role: UserRole,
  password: string
}

type UserRole = "ADMIN" | "CUSTOMER"

const Form = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [form, setForm] = useState<RegisterInput>({
    name: '',
    email: '',
    role: 'CUSTOMER',
    password: ''
  })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await register(form)
      if (response) {
        showNotify({
          type: "success",
          title: 'Sukses!',
          text: "Login Berhasil!"
        })
        router.push('/dashboard')
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
    <>
      <main className='h-screen flex justify-center items-center bg-gray-200'>
        <div>
          <form
            onSubmit={handleRegister}
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
          >
            <div className='flex justify-center'>
              <Image src={Logo} alt='Logo' width={92} />
            </div>
            <FormGroup label='name' required={true}>
              <FormInput
                name='name'
                type='text'
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </FormGroup>
            <Select
              label="Role"
              name="role"
              value={form.role}
              onChange={(value) => setForm({ ...form, role: value as UserRole })}
              options={[
                { label: "Admin", value: "ADMIN" },
                { label: "Customer", value: "CUSTOMER" },
              ]}
            />
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
              disabled={!form.email || !form.password || !form.role || !form.name}
              className='w-full mt-8'>
              Submit
            </Button>
            <div className='flex gap-2 py-4 justify-end borderi'>
              Sudah punya akun ?
              <Link href={'/login'} className='text-amber-800'>Login</Link>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}

export default Form