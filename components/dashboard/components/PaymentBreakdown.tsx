'use client'

import React from 'react'
import { CreditCard, Wallet, DollarSign, type LucideIcon } from 'lucide-react'
import { PaymentBreakdown } from '@/types/dashboard'
import { formatCurrency } from '@/utils/general'

interface PaymentBreakdownProps {
  data: PaymentBreakdown[]
}

interface PaymentMeta {
  label: string
  icon: LucideIcon
  color: string
}

const PAYMENT_META: Record<string, PaymentMeta> = {
  SUCCESS: {
    label: 'Completed',
    icon: CreditCard,
    color: 'text-green-600 bg-green-100',
  },
  PENDING: {
    label: 'Pending',
    icon: Wallet,
    color: 'text-yellow-600 bg-yellow-100',
  },
  CANCEL: {
    label: 'Cancelled',
    icon: DollarSign,
    color: 'text-red-600 bg-red-100',
  },
}

const PaymentBreakdowns: React.FC<PaymentBreakdownProps> = ({ data }) => {
  return (
    <div className="space-y-3">
      {data.map((item) => {
        const meta =
          PAYMENT_META[item.method] ??
          ({
            label: item.method,
            icon: CreditCard,
            color: 'text-gray-600 bg-gray-100',
          } satisfies PaymentMeta)

        const Icon = meta.icon

        return (
          <div key={item.method} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${meta.color}`}>
                <Icon size={16} />
              </div>
              <p className="text-sm font-medium uppercase text-gray-900">
                {meta.label}
              </p>
            </div>

            <p className="text-sm font-semibold text-gray-900">
              {formatCurrency(item.total)}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default PaymentBreakdowns