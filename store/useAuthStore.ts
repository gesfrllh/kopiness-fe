import { create } from 'zustand'
import Cookies from 'js-cookie'
import { AuthState, User } from '@/types/auth/user'
import { formatError } from '@/utils/formatError'
import { getMe, login, logout } from '@/lib/api/auth'

type SetStateFn = (partial: Partial<AuthState> | ((state: AuthState) => Partial<AuthState>)) => void

const STORAGE_KEY = 'kopiness_auth'

// Helper to save auth to localStorage (hanya user, token di cookies)
const saveAuthToStorage = (user: User | null) => {
  if (typeof window !== 'undefined') {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user }))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }
}

const clearAuthHints = () => {
  const options = { path: '/' }
  Cookies.remove('status', options)
  Cookies.remove('role', options)
  Cookies.remove('is_logged_in', options)
  Cookies.remove('store_id', options)
}

export const useAuthStore = create<AuthState>((set: SetStateFn) => {
  return {
    user: null,
    token: null,
    role: null,
    loading: false,
    error: null,
    isHydrated: false,

    login: async (email: string, password: string) => {
      set({ loading: true, error: null })
      try {
        const res = await login(email, password)

        // These cookies drive navigation only; the backend authorizes every API request.
        Cookies.set("role", res.user.role, { path: "/", sameSite: "strict" })
        Cookies.set("is_logged_in", res.isLoggedIn, { path: "/", sameSite: "strict" })
        if (res.user.store_id) {
          Cookies.set("store_id", res.user.store_id, { path: "/", sameSite: "strict" })
        }

        // Save user to localStorage (token di httpOnly cookies)
        saveAuthToStorage(res.user)

        set({
          user: res.user,
          token: null, // Token di httpOnly cookies, tidak disimpan di state
          loading: false,
          role: res.user.role,
          error: null
        })
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

        // Clear dari localStorage
        saveAuthToStorage(null)

        set({
          user: null,
          token: null,
          role: null,
          loading: false,
          error: null
        })
        clearAuthHints()
      } catch (error: unknown) {
        const message = formatError(error) || 'Logout Failed'
        set({ error: message, loading: false })
        throw new Error(message)
      }
    },

    // Backend session is authority; localStorage only mirrors verified user data.
    hydrate: async () => {
      try {
        const session = await getMe()
        if (!session?.isLoggedIn || !session.user) throw new Error('Invalid session')

        const user = session.user as User
        clearAuthHints()
        Cookies.set('role', user.role ?? '', { path: '/', sameSite: 'strict' })
        Cookies.set('is_logged_in', 'true', { path: '/', sameSite: 'strict' })
        if (user.store_id) Cookies.set('store_id', user.store_id, { path: '/', sameSite: 'strict' })
        saveAuthToStorage(user)
        set({ user, token: null, role: user.role ?? null, loading: false, error: null, isHydrated: true })
      } catch {
        saveAuthToStorage(null)
        clearAuthHints()
        set({ user: null, token: null, role: null, loading: false, error: null, isHydrated: true })
      }
    },

    clearSession: () => {
      saveAuthToStorage(null)
      clearAuthHints()
      set({ user: null, token: null, role: null, loading: false, error: null, isHydrated: true })
    },

    setError: (error: string | null) => set({ error })
  }
})
