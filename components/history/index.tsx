'use client'

import React, { useEffect } from "react";
import { Icon } from '@iconify/react'
import Table from "../Base/Table";
import FormInput from "../Base/FormInput";
import Pagination from "../Base/Pagination";
import { useHistoryStore } from "@/store/useHistory";
import AnimationLogin from "../animation/AnimationLogin";
import Select from "../Base/Select";
import TrackingModal from './TrackingModal'
import { PageContainer, PageHeader, Card } from '@/components/Base/PageContainer'

const History = () => {

  const {
    payload,
    totalPages,
    setSearch,
    total,
    getHistory,
    history,
    setLimit,
    selectedStatus,
    setSelectedStatus,
    setPage,
    search,
    columns,
    loading } = useHistoryStore();

  const displayData = history

  useEffect(() => {
    void getHistory()

    const refreshInterval = window.setInterval(() => {
      void getHistory()
    }, 15_000)

    return () => window.clearInterval(refreshInterval)
  }, [getHistory])

  const opts = [
    { value: 'PENDING', label: 'PENDING' },
    { value: 'PAID', label: 'PAID' },
    { value: 'ACCEPTED', label: 'ACCEPTED' },
    { value: 'REJECTED', label: 'REJECTED' },
    { value: 'PREPARING', label: 'PREPARING' },
    { value: 'HANDED_TO_COURIER', label: 'HANDED TO COURIER' },
    { value: 'ON_DELIVERY', label: 'ON DELIVERY' },
    { value: 'DELIVERED', label: 'DELIVERED' },
    { value: 'CANCELLED', label: 'CANCELLED' },
  ]

  return (
    <PageContainer>
      <PageHeader
        title="Payment History"
        subtitle="Manage and track your transactions"
      />

      <Card padding={false}>
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 md:px-6 py-4 md:py-5 border-b border-[#DCD9D5]">
          <h2 className="text-base font-semibold text-[#2D2D2D]">Transactions</h2>

          <div className="flex flex-col md:flex-row gap-3 md:items-center w-full md:w-auto">
            <div className="w-full md:w-44">
              <Select
                options={opts}
                label=""
                name="Status"
                onChange={setSelectedStatus}
                value={selectedStatus} />
            </div>
            <div className="relative w-full md:w-60">
              <Icon icon="mdi:magnify" width={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7F7E77]" />
              <FormInput
                name="search"
                value={search}
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-[#DCD9D5] bg-transparent pl-9 pr-4 py-2 text-sm text-[#2D2D2D] outline-none focus:border-[#BD6230] transition-colors placeholder:text-[#7F7E77]/60"
                placeholder="Search order..."
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="p-4 md:p-6">
          <Table columns={columns} data={displayData} />
        </div>

        <div className="px-4 md:px-6 pb-4 md:pb-6">
          <Pagination
            page={payload.page as number}
            limit={payload.limit as number}
            totalPages={totalPages}
            totalData={total}
            siblingCount={1}
            boundaryCount={1}
            onPageChange={(newPage) => setPage(newPage)}
            onLimitChange={(newLimit) => setLimit(newLimit)}
          />
        </div>
      </Card>
      {loading ? <AnimationLogin /> : ''}
      <TrackingModal />
    </PageContainer>
  )
}

export default History
