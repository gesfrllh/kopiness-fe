import { create } from 'zustand'
import Cookies from 'js-cookie'
import client from '@/lib/apollo'
import { LOGIN_MUTATION } from '@/graphql/mutations/login'
import { gql } from '@apollo/client'
import { AuthPayload, AuthState } from '@/types/auth/user'
import { formatError } from '@/utils/formatError'

type SetStateFn = (partial: Partial<AuthState> | ((state: AuthState) => Partial<AuthState>)) => void

export const useAuthStore = create<AuthState>((set: SetStateFn) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null })
    try {
      const res = await client.mutate<{ login: AuthPayload }, { input: { email: string, password: string } }>({
        mutation: LOGIN_MUTATION,
        variables: { input: { email, password } }
      })

      if (!res.data) throw new Error('No data returned!')

      Cookies.set('token', res.data.login.token, { expires: 1 })

      set({
        user: res.data.login.user,
        token: res.data.login.token,
        loading: false
      })

    } catch (error: unknown) {
      set({ error: formatError(error) || 'Login Failed', loading: false })
    }
  },

  logout: async () => {
    set({ loading: true })
    try {
      const token = Cookies.get('token')

      await client.mutate({
        mutation: gql`
          mutation {
            logout
          }
        `,
        context: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      });

      Cookies.remove('token')
      await client.clearStore()

      set({
        user: null,
        token: null,
        loading: false
      })
    } catch (error: unknown) {
      set({ error: formatError(error) || 'Logout Failed', loading: false })
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