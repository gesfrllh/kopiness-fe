import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useUserManagementStore } from '@/store/useUserManagementStore'

vi.mock('@/lib/api/auth', () => ({
  adminCreateUser: vi.fn(),
}))

import { adminCreateUser } from '@/lib/api/auth'

describe('useUserManagementStore', () => {
  beforeEach(() => {
    useUserManagementStore.setState({ users: [], loading: false, creating: false })
    vi.clearAllMocks()
  })

  it('initial state', () => {
    const state = useUserManagementStore.getState()
    expect(state.users).toEqual([])
    expect(state.creating).toBe(false)
  })

  it('fetchUsers populates dummy users', () => {
    useUserManagementStore.getState().fetchUsers()
    expect(useUserManagementStore.getState().users.length).toBeGreaterThan(0)
  })

  it('createUser returns true on success', async () => {
    vi.mocked(adminCreateUser).mockResolvedValue(undefined)

    const result = await useUserManagementStore.getState().createUser({
      name: 'New Owner',
      email: 'owner@test.com',
      password: 'pass123',
      role: 'STOREOWNER',
    })

    expect(result).toBe(true)
    expect(useUserManagementStore.getState().creating).toBe(false)
  })

  it('createUser returns false on API error', async () => {
    vi.mocked(adminCreateUser).mockRejectedValue(new Error('Failed'))

    const result = await useUserManagementStore.getState().createUser({
      name: 'New Owner',
      email: 'owner@test.com',
      password: 'pass123',
      role: 'STOREOWNER',
    })

    expect(result).toBe(false)
    expect(useUserManagementStore.getState().creating).toBe(false)
  })
})
