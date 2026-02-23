'use client'

import React from 'react'
import { RecentTransaction } from '@/types/dashboard'
import { formatCurrency } from '@/utils/general'
import { formatDate } from '@/utils/general'

interface RecentTransactionsProps {
  data: RecentTransaction[]
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ data }) => {
  const getStatusColor = (status: RecentTransaction['status']) => {
    const styles: Record<RecentTransaction['status'], string> = {
      PAID: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      CANCELLED: 'bg-red-100 text-red-800',
    }
    return styles[status]
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-gray-200">
          <tr>
            <th className="text-left py-3 px-4">Order</th>
            <th className="text-left py-3 px-4">Total</th>
            <th className="text-left py-3 px-4">Date</th>
            <th className="text-left py-3 px-4">Status</th>
          </tr>
        </thead>

        <tbody>
          {data.length ? (
            data.map(tx => (
              <tr key={tx.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-amber-900">
                  {tx.orderNumber ?? '-'}
                </td>

                <td className="py-3 px-4 font-semibold">
                  {formatCurrency(tx.total)}
                </td>

                <td className="py-3 px-4 text-gray-600">
                  {formatDate(tx.createdAt, 'withTime')}
                  {/* {new Date(tx.createdAt).toLocaleDateString('id-ID')} */}
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      tx.status
                    )}`}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-8 text-center text-gray-500">
                No recent transactions
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default RecentTransactions