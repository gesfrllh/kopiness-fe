/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import React from 'react'
import { Modal } from '@/components/Base/ui/Modal/Modal'
import { useHistoryStore } from '@/store/useHistory'
import { formatCurrency } from '@/utils/general'

const TrackingModal: React.FC = () => {
  const { trackModal, closeTrack } = useHistoryStore()
  const entry = trackModal.entry

  if (!trackModal.open || !entry) return null

  const t = entry.tracking

  return (
    <Modal open={trackModal.open} onClose={closeTrack} title={`Tracking ${t?.trackingId ?? ''}`} size="md">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-neutral-500">Invoice</div>
            <div className="font-semibold">{entry.invoiceNumber ?? entry.orderNumber ?? '-'}</div>
          </div>

          <div className="text-right">
            <div className="text-sm text-neutral-500">Total</div>
            <div className="font-semibold">{formatCurrency(entry.total ?? 0)}</div>
          </div>
        </div>

        <div className="p-4 rounded-lg theme-card border theme-border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-neutral-500">Tracking ID</div>
              <div className="font-mono font-semibold">{t?.trackingId ?? '-'}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-neutral-500">Status</div>
              <div className="px-3 py-1 rounded-full bg-[#F3F4F6] text-sm font-semibold">{t?.status ?? '-'}</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm font-semibold mb-2">Timeline</div>
            <div className="space-y-2">
              {t?.events?.map((e: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <div className="text-sm font-medium">{e.description ?? '-'}</div>
                    <div className="text-xs text-neutral-500">{new Date(e?.time).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => {
                if (t?.trackingId) navigator.clipboard.writeText(t.trackingId)
              }}
              className="px-4 py-2 rounded-md border theme-border"
            >
              Copy
            </button>
            <button
              onClick={closeTrack}
              className="px-4 py-2 rounded-md bg-primary text-white"
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
