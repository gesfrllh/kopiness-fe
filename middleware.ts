import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { canVisit, homeForRole, isRole } from '@/lib/auth/routes'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAuthPage = pathname === '/login'
  const isProtectedPage = pathname.startsWith('/manage')

  const isLoggedIn =
    request.cookies.get('is_logged_in')?.value === 'true'
  const roleHint = request.cookies.get('role')?.value
  const role = isRole(roleHint) ? roleHint : undefined

  if (pathname === '/') {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return redirectByRole(role, request)
  }

  if (!isLoggedIn && isProtectedPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isLoggedIn && isAuthPage) {
    return redirectByRole(role, request)
  }

  if (isLoggedIn && isProtectedPage) {
    // Cookies are navigation hints only. Backend authorizes every API request.
    if (!role || !canVisit(role, pathname)) {
      return redirectByRole(role, request)
    }
  }

  const isKnownPath =
    isAuthPage ||
    isProtectedPage ||
    pathname === '/'

  if (isLoggedIn && !isKnownPath) {
    return redirectByRole(role, request)
  }

  if (!isLoggedIn && pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

function redirectByRole(role: string | undefined, request: NextRequest) {
  return NextResponse.redirect(new URL(role && isRole(role) ? homeForRole(role) : '/login', request.url))
}

export const config = {
  matcher: ['/', '/login', '/manage/:path*'],
}
