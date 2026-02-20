'use client'

import React, { useMemo } from 'react'
import { CashierResponse } from '@/types/cashier'
import { formatCurrency } from '@/utils/general'
import { TrendingUp } from 'lucide-react'

interface TopProductsProps {
  cashier: CashierResponse[]
}

const TopProducts: React.FC<TopProductsProps> = ({ cashier }) => {
  const topProducts = useMemo(() => {
    const productSales: Record<string, { name: string; qty: number; revenue: number }> = {}

    // Count sales from cashier
    cashier.forEach((transaction) => {
      transaction.items.forEach((item) => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            name: item.productName,
            qty: 0,
            revenue: 0,
          }
        }
        productSales[item.productId].qty += item.quantity
        productSales[item.productId].revenue += item.subtotal
      })
    })

    return Object.values(productSales)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5)
  }, [cashier])

  const totalSold = useMemo(() => {
    return topProducts.reduce((sum, p) => sum + p.qty, 0)
  }, [topProducts])

  return (
    <div>
      {topProducts.length > 0 ? (
        <>
          <p className="text-gray-600 text-sm mb-4">
            <span className="font-semibold text-gray-900">{totalSold}</span> units sold
          </p>
          <div className="space-y-3">
            {topProducts.map((product, idx) => {
              const percentage = (product.qty / Math.max(...topProducts.map((p) => p.qty), 1)) * 100
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.qty} units sold</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300"
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
          <div className="flex justify-center mb-2">
            <TrendingUp className="text-gray-400" size={32} />
          </div>
          <p>No product sales yet</p>
        </div>
      )}
    </div>
  )
}

export default TopProducts
