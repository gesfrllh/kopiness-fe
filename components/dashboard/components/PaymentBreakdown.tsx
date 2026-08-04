'use client'

import React from 'react'
import { Icon } from '@iconify/react'
import { PaymentBreakdown } from '@/types/dashboard'
import { formatCurrency } from '@/utils/general'

interface PaymentBreakdownProps {
  data: PaymentBreakdown[]
}

const PAYMENT_META: Record<string, { label: string; icon: string; bg: string; color: string }> = {
  SUCCESS: { label: 'Completed', icon: 'mdi:credit-card', bg: 'bg-green-100', color: 'text-green-700' },
  PENDING: { label: 'Pending', icon: 'mdi:wallet', bg: 'bg-yellow-100', color: 'text-yellow-700' },
  CANCEL: { label: 'Cancelled', icon: 'mdi:cancel', bg: 'bg-red-100', color: 'text-red-700' },
}

const PaymentBreakdowns: React.FC<PaymentBreakdownProps> = ({ data }) => {
  return (
    <div className="space-y-3">
      {data.map((item) => {
        const meta = PAYMENT_META[item.method] ?? {
          label: item.method,
          icon: 'mdi:credit-card',
          bg: 'bg-[var(--surface-muted)]',
          color: 'text-[var(--muted)]',
        }

        return (
          <div key={item.method} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${meta.bg} ${meta.color}`}>
                <Icon icon={meta.icon} width={16} />
              </div>
              <p className="text-sm font-medium uppercase text-[var(--ink)]">{meta.label}</p>
            </div>
            <p className="text-sm font-semibold text-[var(--ink)]">{formatCurrency(item.total)}</p>
          </div>
        )
      })}
    </div>
  )
}

export default PaymentBreakdowns
