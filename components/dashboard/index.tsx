'use client'

import React, { useEffect } from 'react'
import { Icon } from '@iconify/react'
import { Loader } from 'lucide-react'

import RevenueChart from './components/RevenueChart'
import TopProducts from './components/TopProducts'
import PaymentBreakdown from './components/PaymentBreakdown'
import RecentTransactions from './components/RecentTransactions'

import { useDashboardStore } from '@/store/useDashboardStore'
import { PageContainer, PageHeader, Card, CardHeader } from '@/components/Base/PageContainer'
import { StatCard } from '@/components/Base/PageContainer'

const Dashboard = () => {
  const { data, loading, getOverview } = useDashboardStore()

  useEffect(() => {
    getOverview()
  }, [getOverview])

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="w-8 h-8 animate-spin text-[#BD6230]" />
      </div>
    )
  }

  const { stats, revenueChart, topProducts, paymentBreakdown, recentTransaction } = data

  const statsData = [
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: <Icon icon="mdi:shopping-outline" width={22} />,
      trend: '+12%',
      trendUp: true,
    },
    {
      label: 'Total Revenue',
      value: `Rp ${(stats.totalRevenue / 1_000_000).toFixed(1)}M`,
      icon: <Icon icon="mdi:trending-up" width={22} />,
      trend: '+8%',
      trendUp: true,
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders,
      icon: <Icon icon="mdi:clock-outline" width={22} />,
      trend: '-3%',
      trendUp: false,
    },
    {
      label: 'Completed Orders',
      value: stats.completedOrders,
      icon: <Icon icon="mdi:check-circle-outline" width={22} />,
      trend: '+24%',
      trendUp: true,
    },
  ]

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here&apos;s what&apos;s happening with your coffee shop today."
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsData.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <Card>
            <CardHeader title="Revenue Overview" />
            <RevenueChart data={revenueChart} />
          </Card>

          <Card>
            <CardHeader title="Top Products" />
            <TopProducts data={topProducts} />
          </Card>
        </div>

        {/* Right */}
        <div className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader title="Payment Methods" />
            <PaymentBreakdown data={paymentBreakdown} />
          </Card>

          <Card className="dashboard-highlight bg-gradient-to-br from-[var(--surface)] to-[rgba(189,98,48,0.04)]">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#BD6230]/10 flex items-center justify-center flex-shrink-0">
                <Icon icon="mdi:alert-circle-outline" width={18} className="text-[#BD6230]" />
              </div>
              <div>
                <h4 className="font-semibold text-[var(--ink)] mb-1">Today&apos;s Highlights</h4>
                <p className="text-sm text-[var(--muted)]">
                  {stats.pendingOrders > 0
                    ? `${stats.pendingOrders} order(s) pending payment`
                    : 'All orders completed!'}
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-[var(--muted)]">
              <p><span className="font-semibold text-[var(--ink)]">{topProducts.length}</span> top products tracked</p>
              <p><span className="font-semibold text-[var(--ink)]">{stats.totalOrders}</span> total transactions</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader title="Recent Orders" />
        <RecentTransactions data={recentTransaction} />
      </Card>
    </PageContainer>
  )
}

export default Dashboard
