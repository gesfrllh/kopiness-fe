'use client'

import React from 'react'
import { Modal } from '@/components/Base/ui/Modal/Modal'
import { useHistoryStore } from '@/store/useHistory'
import { formatCurrency } from '@/utils/general'
import { Icon } from '@iconify/react'
import { getDetailsTracking } from '@/lib/api/history'

const TrackingModal: React.FC = () => {
  const { trackModal, closeTrack } = useHistoryStore()
  const [refreshing, setRefreshing] = React.useState(false)
  const entry = trackModal.entry

  if (!trackModal.open || !entry) return null

  const t = entry.tracking

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await getDetailsTracking(entry.id)
    } catch {
      // tracking API not available
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <Modal open={trackModal.open} onClose={closeTrack} title={`Tracking ${t?.trackingId ?? ''}`} size="md">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted">Invoice</div>
            <div className="font-semibold">{entry.invoiceNumber ?? entry.orderNumber ?? '-'}</div>
          </div>

          <div className="text-right">
            <div className="text-sm text-muted">Total</div>
            <div className="font-semibold">{formatCurrency(entry.total ?? 0)}</div>
          </div>
        </div>

        <div className="p-4 rounded-lg theme-card border theme-border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted">Tracking ID</div>
              <div className="font-mono font-semibold">{t?.trackingId ?? '-'}</div>
            </div>
            <div className="text-right flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-gray-100 text-sm font-semibold">
                {t?.status ?? '-'}
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                <Icon
                  icon="mdi:refresh"
                  width={18}
                  className={refreshing ? 'animate-spin' : ''}
                />
              </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm font-semibold mb-2">Timeline</div>
            <div className="space-y-2">
              {t?.events?.map((e, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <div className="text-sm font-medium">{e.description ?? '-'}</div>
                    <div className="text-xs text-muted">
                      {e.time ? new Date(e.time).toLocaleString() : '-'}
                    </div>
                  </div>
                </div>
              ))}
              {(!t?.events || t.events.length === 0) && (
                <p className="text-sm text-muted">Belum ada update tracking.</p>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => {
                if (t?.trackingId) navigator.clipboard.writeText(t.trackingId)
              }}
              className="px-4 py-2 rounded-md border theme-border text-sm"
            >
              Copy ID
            </button>
            <button
              onClick={closeTrack}
              className="px-4 py-2 rounded-md bg-primary text-white text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default TrackingModal
