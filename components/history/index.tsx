'use client'

import React, { useEffect, useState } from "react";
import Table from "../Base/Table";
import FormGroup from "../Base/FormGroup";
import FormInput from "../Base/FormInput";
import Pagination from "../Base/Pagination";
import { useHistoryStore } from "@/store/useHistory";
import AnimationLogin from "../animation/AnimationLogin";
import Select from "../Base/Select";
import TrackingModal from './TrackingModal'
const History = () => {

  const {
    payload,
    totalPages,
    setSearch,
    total,
    getHistory,
    history,
    localHistory,
    setLimit,
    selectedStatus,
    setSelectedStatus,
    setPage,
    search,
    columns,
    loading } = useHistoryStore();

  const displayData = [...localHistory, ...history]
  const [searching, setSearching] = useState('')

  useEffect(() => {
    getHistory()
  }, [])

  const opts = [
    { value: 'PENDING', label: 'PENDING' },
    { value: 'PAID', label: 'PAID' },
    { value: 'IN_PROGRESS', label: 'IN PROGRESS' },
    { value: 'DELIVERED', label: 'DELIVERED' },
    { value: 'CANCELLED', label: 'CANCELLED' },
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searching)
    }, 500);
    return () => clearTimeout(timer)
  }, [searching, setSearching])

  return (
    <>
      <div className="mt-8">

        <div className="mx-auto bg-white rounded-2xl border border-neutral-200 shadow-sm">

          {/* HEADER SECTION */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
            <div>
              <h2 className="text-lg font-semibold text-neutral-800">
                Payment History
              </h2>
              <p className="text-sm text-neutral-500">
                Manage and track your transactions
              </p>
            </div>

            {/* SEARCH */}
            <div className="flex md:flex-row flex-col gap-4 items-center md:w-[720px]">
              <div className="w-full">
                <Select
                  options={opts}
                  label="Status Pembayaran"
                  name="Status"
                  onChange={setSelectedStatus}
                  value={selectedStatus} />
              </div>
              <div className="w-full md:w-72">
                <FormGroup label="Search Order">
                  <FormInput
                    name="search"
                    value={search}
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border px-4"
                  />
                </FormGroup>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="p-6">
            <Table columns={columns} data={displayData} />
          </div>

          <div className="px-6 pb-6">
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
        </div>
      </div>
      {loading ? <AnimationLogin /> : ''}
      <TrackingModal />
    </>

  )
}

export default History
