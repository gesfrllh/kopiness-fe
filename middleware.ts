import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;
  const path = request.nextUrl.pathname;

  const isLoggedIn = !!token;

  if (!isLoggedIn && (path === '/' || path === '/manage' || path.startsWith('/manage/'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isLoggedIn && (path === '/login' || path === '/')) {
    return NextResponse.redirect(new URL('/manage/dashboard', request.url));
  }

  if (role === 'CUSTOMER' && path === '/manage/dashboard') {
    return NextResponse.redirect(new URL('/manage/home', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/manage/:path*'],
};
