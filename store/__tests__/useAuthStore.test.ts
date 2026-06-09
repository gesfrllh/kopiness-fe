import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from '@/store/useAuthStore'

vi.mock('js-cookie', () => ({
  default: {
    set: vi.fn(),
    get: vi.fn(),
    remove: vi.fn(),
  },
}))

vi.mock('@/lib/api/auth', () => ({
  login: vi.fn(),
  logout: vi.fn(),
}))

vi.mock('@/utils/formatError', () => ({
  formatError: vi.fn((err) => {
    if (err instanceof Error) return err.message
    return 'Unknown error'
  }),
}))

import Cookies from 'js-cookie'
import { login, logout } from '@/lib/api/auth'

const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@test.com',
  role: 'SUPERADMIN',
  store_id: 'store-1',
}

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      role: null,
      loading: false,
      error: null,
      isHydrated: false,
    })
    vi.clearAllMocks()
  })

  it('initial state', () => {
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.role).toBeNull()
    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('login sets user and role on success', async () => {
    vi.mocked(login).mockResolvedValue({
      user: mockUser,
      isLoggedIn: 'true',
    })

    await useAuthStore.getState().login('test@test.com', 'password')

    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.role).toBe('SUPERADMIN')
    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
    expect(Cookies.set).toHaveBeenCalledWith('role', 'SUPERADMIN', expect.any(Object))
  })

  it('login throws on error', async () => {
    vi.mocked(login).mockRejectedValue(new Error('User not found'))

    await expect(
      useAuthStore.getState().login('wrong@test.com', 'wrong')
    ).rejects.toThrow('User not found')

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.loading).toBe(false)
    expect(state.error).toBe('User not found')
  })

  it('logout clears user and cookies', async () => {
    vi.mocked(logout).mockResolvedValue(undefined)

    useAuthStore.setState({ user: mockUser, role: 'SUPERADMIN' })
    await useAuthStore.getState().logout()

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.role).toBeNull()
    expect(state.loading).toBe(false)
    expect(Cookies.remove).toHaveBeenCalledWith('role')
    expect(Cookies.remove).toHaveBeenCalledWith('store_id')
  })

  it('hydrate loads user from localStorage', () => {
    const userData = { user: mockUser }
    localStorage.setItem('kopiness_auth', JSON.stringify(userData))

    useAuthStore.getState().hydrate()

    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.role).toBe('SUPERADMIN')
    expect(state.isHydrated).toBe(true)
  })

  it('hydrate sets isHydrated when no stored data', () => {
    localStorage.removeItem('kopiness_auth')

    useAuthStore.getState().hydrate()

    expect(useAuthStore.getState().isHydrated).toBe(true)
    expect(useAuthStore.getState().user).toBeNull()
  })
})
