const USER_FRIENDLY_MESSAGES: Record<string, string> = {
  'Network error': 'Koneksi bermasalah, silakan coba lagi',
  'User not found': 'Email atau password salah',
  'Invalid credentials': 'Email atau password salah',
  'Email already exists': 'Email sudah terdaftar',
  'Unauthorized': 'Sesi habis, silakan login ulang',
  'Forbidden': 'Anda tidak memiliki akses',
  'Not found': 'Data tidak ditemukan',
  'Validation error': 'Data yang dimasukkan tidak valid',
  'Internal server error': 'Terjadi kesalahan, silakan coba lagi',
}

export function formatError(err: unknown): string {
  if (!err || typeof err !== 'object') return 'Terjadi kesalahan'

  let message = ''

  if (err instanceof Error) {
    message = err.message
  } else {
    return 'Terjadi kesalahan'
  }

  return USER_FRIENDLY_MESSAGES[message] || 'Terjadi kesalahan, silakan coba lagi'
}
