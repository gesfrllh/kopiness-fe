'use client'

import React from 'react'
import { HistoryResponseAdmin, HistoryResponseUser } from '@/types/history'
import { formatCurrency } from '@/utils/general'

interface RecentTransactionsProps {
  data: (HistoryResponseAdmin | HistoryResponseUser)[]
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ data }) => {
  const getStatusColor = (status: string) => {
    const styles: Record<string, string> = {
      SUCCESS: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      CANCEL: 'bg-red-100 text-red-800',
    }
    return styles[status] || 'bg-gray-100 text-gray-800'
  }

  const isAdmin = (transaction: HistoryResponseAdmin | HistoryResponseUser): transaction is HistoryResponseAdmin => {
    return 'customer' in transaction
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-gray-200">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Invoice</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Items</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <span className="font-semibold text-amber-900">{transaction.invoiceNumber || transaction.orderNumber || '-'}</span>
                </td>
                <td className="py-3 px-4">
                  {isAdmin(transaction) ? (
                    <div>
                      <p className="font-medium text-gray-900">{transaction.customer.name}</p>
                      <p className="text-xs text-gray-500">{transaction.customer.email}</p>
                    </div>
                  ) : (
                    <p className="text-gray-900">User</p>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className="text-gray-700">{transaction.itemCount} item(s)</span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-gray-900">{formatCurrency(transaction.total)}</span>
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {new Date(transaction.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: '2-digit' })}
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="py-8 text-center text-gray-500">
                No transactions yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default RecentTransactions
