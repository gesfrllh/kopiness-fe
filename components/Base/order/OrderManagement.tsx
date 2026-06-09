"use client"

import React, { useEffect, useMemo, useState } from "react"
import Table from "@/components/Base/Table"
import Button from "@/components/Base/Button"
import Select from "@/components/Base/Select"
import CTA from "@/components/Base/cta"
import { formatCurrency } from "@/utils/general"
import type { Column } from "@/types"
import { DeliveryStatus, Order } from "@/types/order"
import { Truck, Search } from "lucide-react"
import FormInput from "@/components/Base/FormInput"
import { useOrderStore } from "@/store/useOrderStore"
import AnimationLogin from "@/components/animation/AnimationLogin"

const DELIVERY_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DELIVERED", label: "Delivered" },
] as const

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-[#E3F2FD] text-[#1565C0]",
  PAID: "bg-[#E7F4EA] text-[#2E7D32]",
  IN_PROGRESS: "bg-[#FFF3CD] text-[#856404]",
  DELIVERED: "bg-[#D1E7DD] text-[#0F5132]",
  CANCELLED: "bg-[#FFF4E5] text-[#E65100]",
}

const DELIVERY_STYLES: Record<DeliveryStatus, string> = {
  IN_PROGRESS: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
}

function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${className}`}>
      {label.replace(/_/g, " ")}
    </span>
  )
}

function formatId(id: string) {
  return `#${id.replace(/^ORD-/, "")}`
}

export default function OrderManagementPage() {
  const { orders, loading, updating, fetchOrders, setDeliveryStatus } = useOrderStore()
  const [search, setSearch] = useState("")
  const [deliveryFilter, setDeliveryFilter] = useState("")

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const filteredData = useMemo(
    () => orders.filter(item =>
      item.id.toLowerCase().includes(search.toLowerCase()) &&
      (deliveryFilter ? item.deliveryStatus === deliveryFilter : true)
    ), [orders, search, deliveryFilter])

  const handleWaClick = (row: Order) => {
    const phone = row.customerPhone || ""
    const text = `Halo ${row.customer}, pesanan ${row.id} sudah siap diantar!`
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`)
  }

  const handleMarkDelivered = async (id: string) => {
    await setDeliveryStatus(id, "DELIVERED")
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
      render: (_, row) => {
        const isUpdating = updating === row.id
        return (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handleWaClick(row)}
              className="!px-3 !py-1.5 !text-xs"
              disabled={isUpdating}
            >
              WA
            </Button>

            {row.deliveryStatus === "IN_PROGRESS" && (
              <Button
                variant="outline"
                onClick={() => handleMarkDelivered(row.id)}
                className="!px-3 !py-1.5 !text-xs"
                disabled={isUpdating}
              >
                {isUpdating ? '...' : 'Selesai'}
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <>
      <CTA
        title="Order Management"
        subtitle="Manage delivery"
        icon={<Truck className="w-5 h-5" />}
      />

      <div className="bg-colors-var rounded-lg my-8 py-4 px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-300">
          <span className="text-lg font-semibold text-gray-800">Orders</span>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
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
            <div className="w-full sm:w-44">
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

        <div className="py-6">
          {loading ? <AnimationLogin /> : <Table columns={columns} data={filteredData} />}
        </div>
      </div>
    </>
  )
}
