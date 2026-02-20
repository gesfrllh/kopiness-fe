'use client'

import React, { useMemo } from 'react'
import { HistoryResponseAdmin, HistoryResponseUser } from '@/types/history'
import { CreditCard, DollarSign, Wallet } from 'lucide-react'

interface PaymentBreakdownProps {
  data: (HistoryResponseAdmin | HistoryResponseUser)[]
}

const PaymentBreakdown: React.FC<PaymentBreakdownProps> = ({ data }) => {
  const paymentStats = useMemo(() => {
    const stats: Record<string, number> = {}

    data.forEach((transaction) => {
      const method = transaction.status || 'Unknown'
      stats[method] = (stats[method] || 0) + 1
    })

    return Object.entries(stats).map(([method, count]) => ({
      method,
      count,
      percentage: data.length > 0 ? (count / data.length) * 100 : 0,
    }))
  }, [data])

  const paymentMethods = [
    { id: 'SUCCESS', label: 'Completed', icon: CreditCard, color: 'text-green-600 bg-green-100' },
    { id: 'PENDING', label: 'Pending', icon: Wallet, color: 'text-yellow-600 bg-yellow-100' },
    { id: 'CANCEL', label: 'Cancelled', icon: DollarSign, color: 'text-red-600 bg-red-100' },
  ]

  const getStats = (id: string) => {
    return paymentStats.find((s) => s.method === id)
  }

  return (
    <div className="space-y-3">
      {paymentMethods.map((method) => {
        const stats = getStats(method.id)
        const Icon = method.icon
        const count = stats?.count || 0
        const percentage = stats?.percentage || 0

        return (
          <div key={method.id} className="space-y-1">
            <div className="flex items-center gap-3 justify-between">
              <div className="flex items-center gap-2 flex-1">
                <div className={`p-2 rounded-lg ${method.color}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{method.label}</p>
                  <p className="text-xs text-gray-500">{count} transactions</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900">{percentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  method.id === 'SUCCESS'
                    ? 'bg-green-500'
                    : method.id === 'PENDING'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PaymentBreakdown
