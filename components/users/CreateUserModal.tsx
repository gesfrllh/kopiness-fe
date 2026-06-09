'use client'

import { useState } from 'react'
import { Modal } from '@/components/Base/ui/Modal/Modal'
import FormGroup from '@/components/Base/FormGroup'
import FormInput from '@/components/Base/FormInput'
import Button from '@/components/Base/Button'
import { useUserManagementStore } from '@/store/useUserManagementStore'

interface Props {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

const CreateUserModal = ({ open, onClose, onSuccess }: Props) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { creating, createUser } = useUserManagementStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await createUser({ name, email, password, role: 'STOREOWNER' })
    if (ok) {
      setName('')
      setEmail('')
      setPassword('')
      onSuccess()
      onClose()
    }
  }

  const isValid = name && email && password

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Tambah Store Owner"
      description="Buat akun baru untuk store owner"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormGroup label="Nama" required>
          <FormInput
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormGroup>

        <FormGroup label="Email" required>
          <FormInput
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>

        <FormGroup label="Password" required>
          <FormInput
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormGroup>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" disabled={!isValid || creating}>
            {creating ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateUserModal
