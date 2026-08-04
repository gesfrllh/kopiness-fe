import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const customerOnlyPaths = ['/manage/home', '/manage/stores', '/manage/cart', '/manage/checkout', '/manage/history']
const staffOnlyPaths = ['/manage/dashboard', '/manage/product', '/manage/order', '/manage/cashier', '/manage/profile']
const courierOnlyPaths = ['/manage/courier']

const matchesPath = (pathname: string, paths: string[]) =>
  paths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

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
    if (role === 'CUSTOMER' && matchesPath(pathname, staffOnlyPaths.concat('/manage/users'))) {
      return NextResponse.redirect(
        new URL('/manage/home', request.url)
      )
    }

    if ((role === 'SUPERADMIN' || role === 'STOREOWNER') && matchesPath(pathname, customerOnlyPaths)) {
      return NextResponse.redirect(
        new URL('/manage/dashboard', request.url)
      )
    }

    if (role !== 'SUPERADMIN' && matchesPath(pathname, ['/manage/users'])) {
      return NextResponse.redirect(
        new URL(role === 'CUSTOMER' ? '/manage/home' : '/manage/dashboard', request.url)
      )
    }

    if (role === 'COURIER' && !matchesPath(pathname, courierOnlyPaths.concat(['/manage/chat', '/manage/profile']))) {
      return NextResponse.redirect(new URL('/manage/courier', request.url))
    }

    if (role !== 'COURIER' && matchesPath(pathname, courierOnlyPaths)) {
      return NextResponse.redirect(new URL('/manage/home', request.url))
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
  if (role === 'COURIER') {
    return NextResponse.redirect(
      new URL('/manage/courier', request.url)
    )
  }

  return role === 'SUPERADMIN' || role === 'STOREOWNER'
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
