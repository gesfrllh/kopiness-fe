import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAuthPage = pathname === '/login'
  const isProtectedPage = pathname.startsWith('/manage')

  const isLoggedIn =
    request.cookies.get('is_logged_in')?.value === 'true'
  const role = request.cookies.get('role')?.value

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
    if (role === 'CUSTOMER' && pathname === '/manage/dashboard') {
      return NextResponse.redirect(
        new URL('/manage/home', request.url)
      )
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
  return role === 'ADMIN'
    ? NextResponse.redirect(
      new URL('/manage/dashboard', request.url)
    )
    : NextResponse.redirect(
      new URL('/manage/home', request.url)
    )
}

export const config = {
  matcher: ['/', '/login', '/manage/:path*'],
}
