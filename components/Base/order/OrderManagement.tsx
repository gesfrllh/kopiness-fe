"use client"

import React, { useMemo, useState } from "react"
import Table from "@/components/Base/Table"
import Button from "@/components/Base/Button"
import Select from "@/components/Base/Select"
import CTA from "@/components/Base/cta"
import { formatCurrency } from "@/utils/general"
import type { Column } from "@/types"
import { Truck, Search } from "lucide-react"
import FormInput from "@/components/Base/FormInput"

type DeliveryStatus = "WAITING_PICKUP" | "ON_DELIVERY" | "DONE"

type Order = {
  id: string
  customer: string
  status: string
  deliveryStatus: DeliveryStatus
  total: number
}

const DELIVERY_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "WAITING_PICKUP", label: "Waiting Pickup" },
  { value: "ON_DELIVERY", label: "On Delivery" },
  { value: "DONE", label: "Done" },
] as const

const STATUS_STYLES: Record<string, string> = {
  PAID: "bg-[#E7F4EA] text-[#2E7D32]",
  PENDING: "bg-[#E3F2FD] text-[#1565C0]",
  CANCELLED: "bg-[#FFF4E5] text-[#E65100]",
}

const DELIVERY_STYLES: Record<DeliveryStatus, string> = {
  WAITING_PICKUP: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  ON_DELIVERY: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  DONE: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
}

function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${className}`}>
      {label.replace(/_/g, " ")}
    </span>
  )
}

function formatId(id: string) {
  return `#${id.replace(/^ODR-/, "")}`
}

export default function OrderManagementPage() {
  const [data, setData] = useState<Order[]>([
    { id: "ODR-001", customer: "Budi", status: "PAID", deliveryStatus: "WAITING_PICKUP", total: 120000 },
    { id: "ODR-002", customer: "Andi", status: "PAID", deliveryStatus: "ON_DELIVERY", total: 90000 },
  ])

  const [search, setSearch] = useState("")
  const [deliveryFilter, setDeliveryFilter] = useState("")

  const updateStatus = (id: string, next: DeliveryStatus) =>
    setData(prev => prev.map(item => item.id === id ? { ...item, deliveryStatus: next } : item))

  const filteredData = useMemo(
    () => data.filter(item =>
      item.id.toLowerCase().includes(search.toLowerCase()) &&
      (deliveryFilter ? item.deliveryStatus === deliveryFilter : true)
    ), [data, search, deliveryFilter])

  const handleWaClick = (row: Order) => {
    const text = `Halo, pesanan ${row.id} sudah siap diambil!`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`)
  }

  const columns: Column<Order>[] = [
    {
      id: "id",
      header: "Order",
      render: (_, row) => (
        <span className="font-semibold text-[#5A2D0C]">{formatId(row.id)}</span>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      accessor: "customer",
      render: val => <span className="text-gray-700">{val as string}</span>,
    },
    {
      id: "status",
      header: "Status",
      accessor: "status",
      render: val => <Badge label={val as string} className={STATUS_STYLES[val as string] ?? ""} />,
    },
    {
      id: "deliveryStatus",
      header: "Delivery",
      accessor: "deliveryStatus",
      render: val => <Badge label={val as string} className={DELIVERY_STYLES[val as DeliveryStatus] ?? ""} />,
    },
    {
      id: "total",
      header: "Total",
      accessor: "total",
      render: val => <span className="font-medium text-gray-800">{formatCurrency(val as number)}</span>,
    },
    {
      id: "action",
      header: "",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button onClick={() => handleWaClick(row)} className="!px-3 !py-1.5 !text-xs">
            WA
          </Button>

          {row.deliveryStatus === "WAITING_PICKUP" && (
            <Button variant="outline" onClick={() => updateStatus(row.id, "ON_DELIVERY")} className="!px-3 !py-1.5 !text-xs">
              Pickup
            </Button>
          )}

          {row.deliveryStatus === "ON_DELIVERY" && (
            <Button variant="outline" onClick={() => updateStatus(row.id, "DONE")} className="!px-3 !py-1.5 !text-xs">
              Selesai
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <>
      <CTA
        title="Order Management"
        subtitle="Manage delivery & driver"
        icon={<Truck className="w-5 h-5" />}
      />

      <div className="bg-colors-var rounded-lg my-8 py-4 px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-300">
          <span className="text-lg font-semibold text-gray-800">Orders</span>

          <div className="flex items-center gap-3">
            <div className="relative w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <FormInput
                name="search"
                value={search}
                type="text"
                onChange={e => setSearch(e.target.value)}
                placeholder="Search order..."
                className="w-full !pl-9 !text-sm !rounded-lg !border-gray-300 !bg-gray-50"
              />
            </div>
            <div className="w-44">
              <Select
                options={DELIVERY_OPTIONS as unknown as { label: string; value: string }[]}
                label=""
                name="delivery"
                value={deliveryFilter}
                onChange={setDeliveryFilter}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="py-6">
          <Table columns={columns} data={filteredData} />
        </div>
      </div>
    </>
  )
}
