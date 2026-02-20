'use client'

import React, { useMemo } from 'react'
import { HistoryResponseAdmin, HistoryResponseUser } from '@/types/history'

interface RevenueChartProps {
  data: (HistoryResponseAdmin | HistoryResponseUser)[]
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const revenueData = useMemo(() => {
    // Group revenue by day
    const groupedByDay: Record<string, number> = {}

    data.forEach((transaction) => {
      if (transaction.status === 'SUCCESS') {
        const day = new Date(transaction.createdAt).toLocaleDateString('id-ID', { month: 'short', day: '2-digit' })
        groupedByDay[day] = (groupedByDay[day] || 0) + transaction.total
      }
    })

    const sortedData = Object.entries(groupedByDay)
      .sort()
      .slice(-7) // Last 7 days

    const maxRevenue = Math.max(...Object.values(groupedByDay), 1)

    return { data: sortedData, max: maxRevenue }
  }, [data])

  const totalRevenue = useMemo(() => {
    return data.reduce((sum, t) => (t.status === 'SUCCESS' ? sum + t.total : sum), 0)
  }, [data])

  return (
    <div>
      {revenueData.data.length > 0 ? (
        <>
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-amber-900">
              Rp {(totalRevenue / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-gray-500 mt-1">From completed orders</p>
          </div>

          <div className="space-y-3">
            {revenueData.data.map(([day, revenue], idx) => {
              const percentage = (revenue / revenueData.max) * 100
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-700 font-medium">{day}</span>
                    <span className="text-gray-600">Rp {(revenue / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <div className="py-8 text-center text-gray-500">
          <p>No revenue data available yet</p>
        </div>
      )}
    </div>
  )
}

export default RevenueChart
