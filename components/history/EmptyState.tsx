const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="text-6xl opacity-40 mb-6">💳</div>
    <h3 className="text-xl font-semibold text-white">
      No Payment History Yet
    </h3>
    <p className="text-neutral-400 mt-2 max-w-sm">
      Your completed transactions will appear here once you make a payment.
    </p>
  </div>
)

export default EmptyState
