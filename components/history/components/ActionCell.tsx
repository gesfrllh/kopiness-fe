'use client'

import { HistoryResponseAdmin, HistoryResponseUser } from "@/types/history"
import ActionDropdown from "./ActionDropdown"
import { useHistoryActions } from "@/hooks/useHistoryActions"
import { useHistoryStore } from "@/store/useHistory"
import Button from "@/components/Base/Button"
import Link from 'next/link'

interface Props {
  row: HistoryResponseAdmin | HistoryResponseUser
}

const ActionCell = ({ row }: Props) => {
  const actions = useHistoryActions(row)
  const openTrack = useHistoryStore((s) => s.openTrack)

  return (
      <div className="flex items-center gap-2">
        <Link
          href={`/manage/history/${row.id}/details`}
          className="rounded-md bg-primary px-3 py-1 text-sm text-white"
        >
          Lacak
        </Link>
        <ActionDropdown item={actions} />
        {row.tracking ? <Button onClick={() => openTrack(row)} className="px-3 py-1 text-sm rounded-md bg-primary text-white">Timeline</Button> : null}
      </div>
  )
}

export default ActionCell
