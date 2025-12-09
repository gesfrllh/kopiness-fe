import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value; // 
  const path = request.nextUrl.pathname;

  const isLoggedIn = !!token;

  // Harus login untuk masuk halaman manage
  if (!isLoggedIn && (path === '/' || path === '/manage' || path.startsWith('/manage/'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika sudah login dan buka login / root
  if (isLoggedIn && (path === '/login' || path === '/')) {
    return NextResponse.redirect(new URL('/manage/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/manage/:path*'],
};
