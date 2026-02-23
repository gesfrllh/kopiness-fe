export interface DashboardStats {
  totalOrders: number,
  totalRevenue: number
  pendingOrders: number
  completedOrders: number
}

export interface RevenueChart {
  date: string,
  total: number
}

export interface TopProducts {
  productId: string
  name: string
  qty: number
  revenue: number
}

export interface PaymentBreakdown {
  method: string
  total: number
}

export interface RecentTransaction {
  id: string,
  orderNumber: string | null
  total: number
  status: string
  createdAt: string
}

export interface DashboardOverview {
  stats: DashboardStats
  revenueChart: RevenueChart[]
  topProducts: TopProducts[]
  paymentBreakdown: PaymentBreakdown[]
  recentTransaction: RecentTransaction[]
}