import { create } from 'zustand'
import Cookies from 'js-cookie'
import { AuthState, User } from '@/types/auth/user'
import { formatError } from '@/utils/formatError'
import { login, logout } from '@/lib/api/auth'

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

// Helper to load auth from localStorage
const loadAuthFromStorage = (): { user: User } | null => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }
  return null
}

export const useAuthStore = create<AuthState>((set: SetStateFn) => {
  // Load dari localStorage saat store dibuat
  const initialState = (() => {
    const stored = loadAuthFromStorage()
    if (stored) {
      return {
        user: stored.user,
        token: null,
        role: stored.user?.role || null,
        loading: false,
        error: null,
        isHydrated: false, // Will be set to true after hydration
      }
    }
    return {
      user: null,
      token: null,
      role: null,
      loading: false,
      error: null,
      isHydrated: false, // Will be set to true after hydration
    }
  })()

  return {
    ...initialState,

    login: async (email: string, password: string) => {
      set({ loading: true, error: null })
      try {
        const res = await login(email, password)

        Cookies.set("role", res.user.role, { path: "/", secure: true, sameSite: "strict" })
        Cookies.set("is_logged_in", res.isLoggedIn, { path: "/", secure: true, sameSite: "strict" })
        if (res.user.store_id) {
          Cookies.set("store_id", res.user.store_id, { path: "/", secure: true, sameSite: "strict" })
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
        Cookies.remove('status')
        Cookies.remove('role')
        Cookies.remove('is_logged_in')
        Cookies.remove('store_id')
      } catch (error: unknown) {
        const message = formatError(error) || 'Logout Failed'
        set({ error: message, loading: false })
        throw new Error(message)
      }
    },

    // Initialize store dari localStorage on app load (fallback jika diperlukan)
    hydrate: () => {
      const stored = loadAuthFromStorage()
      if (stored) {
        set({
          user: stored.user,
          token: null, // Token di httpOnly cookies
          role: stored.user?.role || null,
          loading: false,
          error: null,
          isHydrated: true
        })
      } else {
        set({ isHydrated: true })
      }
    },

    setError: (error: string | null) => set({ error })
  }
})