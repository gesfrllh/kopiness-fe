'use client'

import { getDetail } from "@/pages/api/history/history";
import React, { useEffect } from "react";
export default function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = React.use(params)
  useEffect(() => {
    getDetail(id)
  }, [])
  return <div>
  </div>
}
