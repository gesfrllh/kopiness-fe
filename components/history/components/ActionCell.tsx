'use client'

import { HistoryResponseAdmin, HistoryResponseUser } from "@/types/history"
import ActionDropdown from "./ActionDropdown"
import { useHistoryActions } from "@/hooks/useHistoryActions"
import { useHistoryStore } from "@/store/useHistory"
import Button from "@/components/Base/Button"

interface Props {
  row: HistoryResponseAdmin | HistoryResponseUser
}

const ActionCell = ({ row }: Props) => {
  const actions = useHistoryActions(row)
  const openTrack = useHistoryStore((s) => s.openTrack)

  return (
    <>
      <div>
        <ActionDropdown item={actions} />
        {row.tracking ? (
          <Button
            onClick={() => openTrack(row)}
            className="px-3 py-1 text-sm rounded-md bg-primary text-white"
          />
        ) : null}
      </div>
    </>
  )
}

export default ActionCell