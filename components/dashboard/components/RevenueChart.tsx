'use client'

import { RevenueChart } from '@/types/dashboard'
import { formatDate } from '@/utils/general'
import React, { useMemo } from 'react'

interface RevenueChartProps {
  data: RevenueChart[]
}

const RevenueCharts: React.FC<RevenueChartProps> = ({ data }) => {
  const maxRevenue = useMemo(
    () => Math.max(...data.map(d => d.total), 1),
    [data]
  )

  const totalRevenue = useMemo(
    () => data.reduce((sum, d) => sum + d.total, 0),
    [data]
  )

  if (data.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>No revenue data available yet</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
        <p className="text-3xl font-bold text-amber-900">
          Rp {(totalRevenue / 1_000_000).toFixed(1)}M
        </p>
        <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
      </div>

      {/* Bars */}
      <div className="space-y-3">
        {data.map((item, idx) => {
          const percentage = (item.total / maxRevenue) * 100

          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-center text-xs flex-wrap gap-1">
                <span className="text-gray-700 font-medium">{formatDate(item.date, 'long')}</span>
                <span className="text-gray-600">
                  Rp {(item.total / 1_000_000).toFixed(2)}M
                </span>
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
    </div>
  )
}

export default RevenueCharts