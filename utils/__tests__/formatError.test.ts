import { describe, it, expect } from 'vitest'
import { formatError } from '@/utils/formatError'

describe('formatError', () => {
  it('returns mapped message for known errors', () => {
    expect(formatError(new Error('User not found'))).toBe('Email atau password salah')
    expect(formatError(new Error('Invalid credentials'))).toBe('Email atau password salah')
    expect(formatError(new Error('Email already exists'))).toBe('Email sudah terdaftar')
    expect(formatError(new Error('Unauthorized'))).toBe('Sesi habis, silakan login ulang')
    expect(formatError(new Error('Forbidden'))).toBe('Anda tidak memiliki akses')
    expect(formatError(new Error('Network error'))).toBe('Koneksi bermasalah, silakan coba lagi')
    expect(formatError(new Error('Not found'))).toBe('Data tidak ditemukan')
    expect(formatError(new Error('Validation error'))).toBe('Data yang dimasukkan tidak valid')
    expect(formatError(new Error('Internal server error'))).toBe('Terjadi kesalahan, silakan coba lagi')
  })

  it('returns generic message for unmapped errors', () => {
    expect(formatError(new Error('Something weird happened'))).toBe('Terjadi kesalahan, silakan coba lagi')
  })

  it('handles null or undefined gracefully', () => {
    expect(formatError(null)).toBe('Terjadi kesalahan')
    expect(formatError(undefined)).toBe('Terjadi kesalahan')
    expect(formatError('string')).toBe('Terjadi kesalahan')
  })

  it('handles non-Error objects', () => {
    expect(formatError({ custom: 'error' })).toBe('Terjadi kesalahan')
  })
})
