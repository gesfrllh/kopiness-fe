export type Role = 'SUPERADMIN' | 'STOREOWNER' | 'COURIER' | 'CUSTOMER'

const routesByRole: Record<Role, string[]> = {
  SUPERADMIN: ['/manage/home', '/manage/dashboard', '/manage/users', '/manage/product', '/manage/order', '/manage/cashier', '/manage/stores', '/manage/history', '/manage/coffee', '/manage/profile', '/manage/chat'],
  STOREOWNER: ['/manage/home', '/manage/dashboard', '/manage/product', '/manage/order', '/manage/cashier', '/manage/stores', '/manage/history', '/manage/coffee', '/manage/profile', '/manage/chat'],
  COURIER: ['/manage/courier', '/manage/profile', '/manage/chat'],
  CUSTOMER: ['/manage/home', '/manage/stores', '/manage/cart', '/manage/checkout', '/manage/history', '/manage/profile'],
}

export function isRole(value: string | undefined): value is Role {
  return value === 'SUPERADMIN' || value === 'STOREOWNER' || value === 'COURIER' || value === 'CUSTOMER'
}

export function matchesRoute(pathname: string, routes: string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}

export function canVisit(role: Role, pathname: string) {
  return matchesRoute(pathname, routesByRole[role])
}

export function homeForRole(role: Role) {
  if (role === 'COURIER') return '/manage/courier'
  if (role === 'SUPERADMIN' || role === 'STOREOWNER') return '/manage/dashboard'
  return '/manage/home'
}
