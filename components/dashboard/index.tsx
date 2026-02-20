'use client'

import React, { useEffect, useState } from 'react'
import { useCashierStore } from '@/store/useCashierStore'
import { useProductStore } from '@/store/useProductStore'
import { useHistoryStore } from '@/store/useHistory'
import { motion } from 'framer-motion'
import { ShoppingCart, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import StatsCard from './components/StatsCard'
// import RecentTransactions from './components/RecentTransactions'
// import RevenueChart from './components/RevenueChart'
// import TopProducts from './components/TopProducts'
// import PaymentBreakdown from './components/PaymentBreakdown'
import LoaderTransition from '@/components/LoaderTransition'
import RevenueChart from './components/RevenueChart'
import TopProducts from './components/TopProducts'
import PaymentBreakdown from './components/PaymentBreakdown'
import RecentTransactions from './components/RecentTransactions'

const Dashboard = () => {
  const [loader, setLoader] = useState(false)
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  })

  const { getCashier, Cashier } = useCashierStore()
  const { getProduct, products } = useProductStore()
  const { getHistory, history } = useHistoryStore()

  useEffect(() => {
    const loadData = async () => {
      try {
        await getCashier()
        await getProduct()
        await getHistory()
        setLoader(true)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        setLoader(true)
      }
    }

    loadData()
  }, [getCashier, getProduct, getHistory])

  useEffect(() => {
    if (history && history.length > 0) {
      const completed = history.filter(t => t.status === 'SUCCESS').length
      const pending = history.filter(t => t.status === 'PENDING').length
      const revenue = history.reduce((sum, t) => sum + (t.total || 0), 0)

      setStats({
        totalOrders: history.length,
        totalRevenue: revenue,
        pendingOrders: pending,
        completedOrders: completed
      })
    }
  }, [history])

  const statsData = [
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'from-blue-500 to-blue-600',
      trend: '+12%'
    },
    {
      label: 'Total Revenue',
      value: `Rp ${(stats.totalRevenue / 1000000).toFixed(1)}M`,
      icon: TrendingUp,
      color: 'from-emerald-500 to-emerald-600',
      trend: '+8%'
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      trend: '-3%'
    },
    {
      label: 'Completed Orders',
      value: stats.completedOrders,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      trend: '+24%'
    }
  ]

  return (
    <>
      <LoaderTransition onFinish={() => setLoader(true)} />
      {loader && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full space-y-8"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600 text-sm">Welcome back! Here&apos;s what&apos;s happening with your coffee shop today.</p>
          </div>

          {/* Stats Grid */}
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

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Side - Charts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Revenue Chart */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-lg font-bold mb-4 text-gray-900">Revenue Overview</h3>
                <RevenueChart data={history} />
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-lg font-bold mb-4 text-gray-900">Top Products</h3>
                <TopProducts cashier={Cashier} />
              </div>
            </motion.div>

            {/* Right Side - Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-6"
            >
              {/* Payment Breakdown */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-lg font-bold mb-4 text-gray-900">Payment Methods</h3>
                <PaymentBreakdown data={history} />
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="text-amber-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-1">Today&apos;s Highlights</h4>
                    <p className="text-sm text-amber-800">
                      {stats.pendingOrders > 0 ? `${stats.pendingOrders} order(s) pending payment` : 'All orders completed!'}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-amber-900"><span className="font-semibold">{products.length}</span> products available</p>
                  <p className="text-amber-900"><span className="font-semibold">{history.length}</span> total transactions</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
          >
            <h3 className="text-lg font-bold mb-4 text-gray-900">Recent Orders</h3>
            <RecentTransactions data={history.slice(0, 5)} />
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

export default Dashboard
