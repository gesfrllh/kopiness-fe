'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ShoppingCart,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader,
} from 'lucide-react'

import StatsCard from './components/StatsCard'
import RevenueChart from './components/RevenueChart'
import TopProducts from './components/TopProducts'
import PaymentBreakdown from './components/PaymentBreakdown'
import RecentTransactions from './components/RecentTransactions'

import { useDashboardStore } from '@/store/useDashboardStore'

const Dashboard = () => {
  const { data, loading, getOverview } = useDashboardStore()

  useEffect(() => {
    getOverview()
  }, [getOverview])

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    )
  }

  const { stats, revenueChart, topProducts, paymentBreakdown, recentTransaction } = data

  const statsData = [
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'from-blue-500 to-blue-600',
      trend: '+12%',
    },
    {
      label: 'Total Revenue',
      value: `Rp ${(stats.totalRevenue / 1_000_000).toFixed(1)}M`,
      icon: TrendingUp,
      color: 'from-emerald-500 to-emerald-600',
      trend: '+8%',
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      trend: '-3%',
    },
    {
      label: 'Completed Orders',
      value: stats.completedOrders,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      trend: '+24%',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-8"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600 text-sm">
          Welcome back! Here&apos;s what&apos;s happening with your coffee shop today.
        </p>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statsData.map((stat, idx) => (
          <StatsCard
            key={idx}
            label={stat.label}
            value={stat.value}
            Icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
            delay={idx * 0.1}
          />
        ))}
      </motion.div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold mb-4 text-gray-900">
              Revenue Overview
            </h3>
            <RevenueChart data={revenueChart} />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold mb-4 text-gray-900">
              Top Products
            </h3>
            <TopProducts data={topProducts} />
          </div>
        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold mb-4 text-gray-900">
              Payment Methods
            </h3>
            <PaymentBreakdown data={paymentBreakdown} />
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle
                className="text-amber-600 flex-shrink-0 mt-1"
                size={20}
              />
              <div>
                <h4 className="font-semibold text-amber-900 mb-1">
                  Today&apos;s Highlights
                </h4>
                <p className="text-sm text-amber-800">
                  {stats.pendingOrders > 0
                    ? `${stats.pendingOrders} order(s) pending payment`
                    : 'All orders completed!'}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p className="text-amber-900">
                <span className="font-semibold">{topProducts.length}</span>{' '}
                top products tracked
              </p>
              <p className="text-amber-900">
                <span className="font-semibold">
                  {stats.totalOrders}
                </span>{' '}
                total transactions
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
      >
        <h3 className="text-lg font-bold mb-4 text-gray-900">
          Recent Orders
        </h3>
        <RecentTransactions data={recentTransaction} />
      </motion.div>
    </motion.div>
  )
}

export default Dashboard