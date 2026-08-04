import { create } from 'zustand'
import { User, AdminRegisterInput } from '@/types/auth/user'
import { adminCreateUser, getUsers } from '@/lib/api/auth'
import { showNotify } from '@/components/Base/notification/notify-controllers'
import { formatError } from '@/utils/formatError'

interface UserManagementState {
  users: User[]
  loading: boolean
  creating: boolean

  fetchUsers: () => Promise<void>
  createUser: (data: AdminRegisterInput) => Promise<boolean>
}

export const useUserManagementStore = create<UserManagementState>((set, get) => ({
  users: [],
  loading: false,
  creating: false,

  fetchUsers: async () => {
    set({ loading: true })
    try {
      const users = await getUsers()
      set({ users, loading: false })
    } catch (err) {
      set({ users: [], loading: false })
      showNotify({
        type: 'error',
        title: 'Gagal memuat pengguna',
        text: formatError(err),
      })
    }
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
      await get().fetchUsers()
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
