import { groupByMonth } from '@/utils/general'
import type { PaymentHistory } from '@/types/history'
import PaymentCard from './PaymentCard'
import { SkeletonCardHistory } from './Skeleton'
import EmptyState from './EmptyState'

interface Props {
  payments: PaymentHistory[]
  loading?: boolean
}

const PaymentHistory = ({ payments, loading = false }: Props) => {

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCardHistory key={i} />
        ))}
      </div>
    )
  }

  if (!payments.length) return <EmptyState />

  const grouped = groupByMonth(payments)

  return (
    <div className="space-y-10">
      {Object.entries(grouped).map(([month, items]) => (
        <div key={month}>
          <h2 className="text-lg font-semibold text-white mb-4">
            {month}
          </h2>

          <div className="space-y-4">
            {items.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default PaymentHistory
