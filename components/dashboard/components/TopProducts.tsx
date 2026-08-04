'use client'

import React, { useMemo } from 'react'
import { TopProducts } from '@/types/dashboard'
import { formatCurrency } from '@/utils/general'
import { Icon } from '@iconify/react'

interface TopProductsProps {
  data: TopProducts[]
}

const TopProductsCom: React.FC<TopProductsProps> = ({ data }) => {
  const totalSold = useMemo(
    () => data.reduce((sum, p) => sum + p.qty, 0),
    [data]
  )

  const maxQty = useMemo(
    () => Math.max(...data.map(p => p.qty), 1),
    [data]
  )

  if (data.length === 0) {
    return (
        <div className="py-8 text-center text-[var(--muted)]">
        <div className="flex justify-center mb-2">
          <Icon icon="mdi:trending-up" width={32} className="text-[#DCD9D5]" />
        </div>
        <p>No product sales yet</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-[var(--muted)] text-sm mb-4">
        <span className="font-semibold text-[var(--ink)]">{totalSold}</span> units sold
      </p>

      <div className="space-y-3">
        {data.map((product, idx) => {
          const percentage = (product.qty / maxQty) * 100

          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--ink)] truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-[var(--muted)]">{product.qty} units sold</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[var(--ink)]">
                    {formatCurrency(product.revenue)}
                  </p>
                </div>
              </div>

              <div className="w-full bg-[var(--surface-muted)] rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#BD6230] to-[#8B4513] rounded-full transition-all duration-300"
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

export default TopProductsCom
