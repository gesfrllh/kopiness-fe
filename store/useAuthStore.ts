import { create } from 'zustand'
import Cookies from 'js-cookie'
import { AuthState } from '@/types/auth/user'
import { formatError } from '@/utils/formatError'
import { login, logout } from '@/pages/api/auth/api'

type SetStateFn = (partial: Partial<AuthState> | ((state: AuthState) => Partial<AuthState>)) => void

export const useAuthStore = create<AuthState>((set: SetStateFn) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  role: null,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null })
    try {
      const res = await login(email, password)

      Cookies.set("token", res.token, { path: "/" })
      Cookies.set("role", res.user.role, { path: "/" })

      set({
        user: res.user,
        token: res.token,
        loading: false
      })

      set({ role: res.user.role })
    } catch (error: unknown) {
      const message = formatError(error) || 'Login Failed'
      set({ error: message, loading: false })
      throw new Error(message)
    }
  },

  logout: async () => {
    set({ loading: true })
    try {
      await logout()

      set({
        user: null,
        token: null,
        loading: false
      })
    } catch (error: unknown) {
      const message = formatError(error) || 'Logout Failed'
      set({ error: message, loading: false })
      throw new Error(message)
    }
  },

  setUserFromCookie: () => {
    const token = Cookies.get('token');
    if (token) {
      set({ token });
    }
  },

  setError: (error: string | null) => set({ error })
}))