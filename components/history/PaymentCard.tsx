'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { PaymentHistory, statusPayment } from '@/types/history'

interface Props {
  payment: PaymentHistory
}

const PaymentCard = ({ payment }: Props) => {
  const [open, setOpen] = useState(false)

  const statusColor = {
    PAID: 'bg-green-500/20 text-green-400',
    PENDING: 'bg-yellow-500/20 text-yellow-400',
    CANCELLED: 'bg-red-500/20 text-red-400',
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 transition hover:shadow-lg hover:shadow-primary/10">

      {/* HEADER */}
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center cursor-pointer"
      >
        <div>
          <h4 className="font-medium text-white">
            {payment.invoice}
          </h4>
          <p className="text-sm text-neutral-400">
            {new Date(payment.createdAt).toDateString()}
          </p>
        </div>

        <div className="text-right flex items-center gap-4">
          <div>
            <p className="font-semibold text-white">
              Rp {payment.amount.toLocaleString()}
            </p>
            <span
              className={clsx(
                'text-xs px-2 py-1 rounded-full',
                statusColor[payment.status as statusPayment]
              )}
            >
              {payment.status}
            </span>
          </div>

          {/* Chevron */}
          <svg
            className={clsx(
              'w-5 h-5 text-neutral-400 transition-transform duration-300',
              open && 'rotate-180'
            )}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* EXPAND */}
      <div
        className={clsx(
          'overflow-hidden transition-all duration-500 ease-in-out',
          open ? 'max-h-96 mt-4' : 'max-h-0'
        )}
      >
        <div className="border-t border-neutral-800 pt-4 text-sm text-neutral-400 space-y-2">
          <p>
            <span className="text-neutral-500">Invoice ID:</span> {payment.id}
          </p>
          <p>
            <span className="text-neutral-500">Payment Method:</span>{' '}
            {payment.paymentMethod}
          </p>

          {payment.status === 'CANCELLED' && (
            <button className="mt-3 px-3 py-1.5 text-sm rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition">
              Retry Payment
            </button>
          )}

          {payment.status === 'PAID' && (
            <button className="mt-3 px-3 py-1.5 text-sm rounded-md bg-primary/20 text-primary hover:bg-primary/30 transition">
              Download Invoice
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentCard
