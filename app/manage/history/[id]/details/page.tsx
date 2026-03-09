'use client'

import Button from "@/components/Base/Button";
import { getDetailsTracking } from "@/pages/api/history/history";
// import { getDetail, getDetailsTracking } from "@/pages/api/history/history";
import { useHistoryStore } from "@/store/useHistory";
import { formatCurrency } from "@/utils/general";
import React, { useEffect } from "react";
export default function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = React.use(params)

  const {
    getDetails,
    details
  } = useHistoryStore()
  useEffect(() => {
    getDetails(id)
  }, [])
  return (
    <>
      <Button onClick={() => getDetailsTracking(id)}>
        Get Tracking Log
      </Button>
      <div>
        {details?.status}
        {details?.payment && (
          <div>
            {formatCurrency(details?.payment.totalAmount as number)}
          </div>
        )}
        {/* {details} */}
      </div>
    </>
  )
}
