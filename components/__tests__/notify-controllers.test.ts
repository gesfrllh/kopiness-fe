import { describe, it, expect, vi } from 'vitest'
import { showNotify, setNotifyHandler } from '@/components/Base/notification/notify-controllers'

describe('notify-controllers', () => {
  it('showNotify warns when handler not set', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    showNotify({ title: 'Test' })
    expect(warn).toHaveBeenCalledWith('Notify system not ready yet')
    warn.mockRestore()
  })

  it('showNotify calls handler when set', () => {
    const handler = vi.fn()
    setNotifyHandler(handler)
    showNotify({ title: 'Test', type: 'success' })
    expect(handler).toHaveBeenCalledWith({ title: 'Test', type: 'success' })
  })
})
