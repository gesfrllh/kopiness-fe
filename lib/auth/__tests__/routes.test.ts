import { describe, expect, it } from 'vitest'
import { canVisit, homeForRole, isRole } from '@/lib/auth/routes'

describe('route matrix', () => {
  it('allows only role routes, including nested pages', () => {
    expect(canVisit('CUSTOMER', '/manage/stores/arabika')).toBe(true)
    expect(canVisit('CUSTOMER', '/manage/profile')).toBe(true)
    expect(canVisit('CUSTOMER', '/manage/dashboard')).toBe(false)
    expect(canVisit('STOREOWNER', '/manage/users')).toBe(false)
    expect(canVisit('SUPERADMIN', '/manage/users')).toBe(true)
    expect(canVisit('COURIER', '/manage/chat')).toBe(true)
    expect(canVisit('COURIER', '/manage/order')).toBe(false)
  })

  it('uses valid role homes and rejects unknown hints', () => {
    expect(homeForRole('COURIER')).toBe('/manage/courier')
    expect(homeForRole('CUSTOMER')).toBe('/manage/home')
    expect(isRole('STOREOWNER')).toBe(true)
    expect(isRole('ADMIN')).toBe(false)
  })
})
