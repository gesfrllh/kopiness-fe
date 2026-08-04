import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useUserManagementStore } from '@/store/useUserManagementStore'

vi.mock('@/lib/api/auth', () => ({
  adminCreateUser: vi.fn(),
  getUsers: vi.fn(),
}))

import { adminCreateUser, getUsers } from '@/lib/api/auth'

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

  it('fetchUsers populates users from the API', async () => {
    vi.mocked(getUsers).mockResolvedValue([
      { id: '1', name: 'Owner', email: 'owner@test.com', role: 'STOREOWNER' },
    ])

    await useUserManagementStore.getState().fetchUsers()

    expect(useUserManagementStore.getState().users).toHaveLength(1)
  })

  it('createUser returns true on success', async () => {
    vi.mocked(adminCreateUser).mockResolvedValue(undefined)
    vi.mocked(getUsers).mockResolvedValue([])

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
