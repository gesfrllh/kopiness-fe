'use client'

import { useRouter } from "next/navigation"
import { ActionProps } from "@/types"
import { HistoryResponseAdmin, HistoryResponseUser } from "@/types/history"

export const useHistoryActions = (
  row: HistoryResponseAdmin | HistoryResponseUser
): ActionProps[] => {
  const router = useRouter()

  return [
    {
      title: 'Details',
      onClick: () => {
        router.push(`/manage/history/${row.id}/details`)
      }
    },
    {
      title: 'Print',
      onClick: () => {
        window.print()
      }
    },
    {
      title: 'Download Invoice',
      onClick: () => { }
    }
  ]
}
