import { describe, it, expect, beforeEach } from 'vitest'
import { usePasswordStore } from '@/store/usePasswordStore'

describe('usePasswordStore', () => {
  beforeEach(() => {
    usePasswordStore.setState({ visibilityMap: {} })
  })

  it('initial state has empty visibility map', () => {
    expect(usePasswordStore.getState().visibilityMap).toEqual({})
  })

  it('isVisible returns false for unknown field', () => {
    expect(usePasswordStore.getState().isVisible('password')).toBe(false)
  })

  it('toggleVisibility sets field to visible', () => {
    usePasswordStore.getState().toggleVisibility('password')
    expect(usePasswordStore.getState().isVisible('password')).toBe(true)
  })

  it('toggleVisibility toggles field back to hidden', () => {
    usePasswordStore.getState().toggleVisibility('password')
    usePasswordStore.getState().toggleVisibility('password')
    expect(usePasswordStore.getState().isVisible('password')).toBe(false)
  })

  it('tracks multiple fields independently', () => {
    usePasswordStore.getState().toggleVisibility('password')
    usePasswordStore.getState().toggleVisibility('confirm')
    expect(usePasswordStore.getState().isVisible('password')).toBe(true)
    expect(usePasswordStore.getState().isVisible('confirm')).toBe(true)
    usePasswordStore.getState().toggleVisibility('password')
    expect(usePasswordStore.getState().isVisible('password')).toBe(false)
    expect(usePasswordStore.getState().isVisible('confirm')).toBe(true)
  })
})
