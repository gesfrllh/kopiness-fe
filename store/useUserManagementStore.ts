import { create } from 'zustand'
import { User, AdminRegisterInput } from '@/types/auth/user'
import { adminCreateUser } from '@/lib/api/auth'
import { showNotify } from '@/components/Base/notification/notify-controllers'
import { formatError } from '@/utils/formatError'

const dummyUsers: User[] = [
  { id: '1', name: 'Ahmad Fauzi', email: 'ahmad@kopiness.com', role: 'STOREOWNER' },
  { id: '2', name: 'Siti Rahma', email: 'siti@kopiness.com', role: 'STOREOWNER' },
  { id: '3', name: 'Budi Santoso', email: 'budi@kopiness.com', role: 'STOREOWNER' },
  { id: '4', name: 'Super Admin', email: 'admin@kopiness.com', role: 'SUPERADMIN' },
]

interface UserManagementState {
  users: User[]
  loading: boolean
  creating: boolean

  fetchUsers: () => void
  createUser: (data: AdminRegisterInput) => Promise<boolean>
}

export const useUserManagementStore = create<UserManagementState>((set) => ({
  users: dummyUsers,
  loading: false,
  creating: false,

  fetchUsers: () => {
    set({ users: dummyUsers })
  },

  createUser: async (data) => {
    set({ creating: true })
    try {
      await adminCreateUser(data)
      showNotify({
        type: 'success',
        title: 'Berhasil!',
        text: 'Store owner berhasil ditambahkan.',
      })
      set({ creating: false })
      return true
    } catch (err) {
      showNotify({
        type: 'error',
        title: 'Gagal!',
        text: formatError(err),
      })
      set({ creating: false })
      return false
    }
  },
}))
