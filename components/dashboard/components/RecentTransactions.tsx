'use client'

import React, { useMemo } from 'react'
import Table from '@/components/Base/Table'
import type { Column } from '@/types'
import { RecentTransaction } from '@/types/dashboard'
import { formatCurrency, formatDate } from '@/utils/general'

interface RecentTransactionsProps {
  data: RecentTransaction[]
}

const STATUS_STYLES: Record<string, string> = {
  PAID: 'bg-green-100 text-green-700',
  PENDING: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-orange-100 text-orange-700',
}

function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${className}`}>
      {label}
    </span>
  )
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ data }) => {
  const columns: Column<RecentTransaction>[] = useMemo(() => [
    {
      id: 'orderNumber',
      header: 'Order',
      render: (_, row) => (
        <span className="font-semibold text-[#5A2D0C]">
          {row.orderNumber ?? '-'}
        </span>
      ),
    },
    {
      id: 'total',
      header: 'Total',
      accessor: 'total',
      render: val => <span className="font-medium text-gray-800">{formatCurrency(val as number)}</span>,
    },
    {
      id: 'createdAt',
      header: 'Date',
      accessor: 'createdAt',
      render: val => <span className="text-gray-600">{formatDate(val as string, 'withTime')}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      render: val => <Badge label={val as string} className={STATUS_STYLES[val as string] ?? ''} />,
    },
  ], [])

  return <Table columns={columns} data={data} />
}

export default React.memo(RecentTransactions)
