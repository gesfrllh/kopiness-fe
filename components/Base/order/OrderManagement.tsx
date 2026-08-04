"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Icon } from '@iconify/react'
import Table from "@/components/Base/Table"
import Button from "@/components/Base/Button"
import Select from "@/components/Base/Select"
import { formatCurrency } from "@/utils/general"
import type { Column } from "@/types"
import { Order, OrderStatus } from "@/types/order"
import FormInput from "@/components/Base/FormInput"
import { useOrderStore } from "@/store/useOrderStore"
import { assignCourier, getCouriers } from '@/lib/api/order'
import { formatError } from '@/utils/formatError'
import { showNotify } from '@/components/Base/notification/notify-controllers'
import AnimationLogin from "@/components/animation/AnimationLogin"
import { PageContainer, PageHeader, Card } from '@/components/Base/PageContainer'

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "PAID", label: "Paid" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "PREPARING", label: "Preparing" },
  { value: "HANDED_TO_COURIER", label: "Handed to Courier" },
  { value: "ON_DELIVERY", label: "On Delivery" },
  { value: "DELIVERED", label: "Delivered" },
] as const

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-[#E3F2FD] text-[#1565C0]",
  PAID: "bg-[#E7F4EA] text-[#2E7D32]",
  ACCEPTED: "bg-[#E3F2FD] text-[#1565C0]",
  REJECTED: "bg-[#FDECEC] text-[#C62828]",
  PREPARING: "bg-[#FFF3CD] text-[#856404]",
  HANDED_TO_COURIER: "bg-[#F3E5F5] text-[#7B1FA2]",
  ON_DELIVERY: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  DELIVERED: "bg-[#D1E7DD] text-[#0F5132]",
  CANCELLED: "bg-[#FFF4E5] text-[#E65100]",
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
  const { orders, loading, updating, fetchOrders, setOrderStatus } = useOrderStore()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [couriers, setCouriers] = useState<{ id: string; name: string }[]>([])
  const [courierByOrder, setCourierByOrder] = useState<Record<string, string>>({})

  useEffect(() => {
    void fetchOrders()
    getCouriers().then((res) => setCouriers(res?.data ?? res ?? [])).catch(() => setCouriers([]))

    const refreshInterval = window.setInterval(() => {
      void fetchOrders()
    }, 15_000)

    return () => window.clearInterval(refreshInterval)
  }, [fetchOrders])

  const filteredData = useMemo(
    () => orders.filter(item =>
      item.id.toLowerCase().includes(search.toLowerCase()) &&
       (statusFilter ? item.status === statusFilter : true)
    ), [orders, search, statusFilter])

  const handleWaClick = (row: Order) => {
    const phone = row.customerPhone || ""
    const text = `Halo ${row.customer}, pesanan ${row.id} sudah siap diantar!`
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`)
  }

  const nextStatus: Partial<Record<OrderStatus, { status: OrderStatus; label: string }>> = {
    PAID: { status: 'ACCEPTED', label: 'Terima' },
    ACCEPTED: { status: 'PREPARING', label: 'Siapkan' },
    PREPARING: { status: 'HANDED_TO_COURIER', label: 'Serahkan' },
  }

  const handleStatusUpdate = async (id: string, status: OrderStatus) => {
    await setOrderStatus(id, status)
  }

  const handleAssignCourier = async (id: string) => {
    const courierId = courierByOrder[id]
    if (!courierId) return
    try {
      await assignCourier(id, courierId)
      showNotify({ type: 'success', title: 'Sukses', text: 'Kurir ditugaskan' })
    } catch (err) {
      showNotify({ type: 'error', title: 'Gagal menugaskan kurir', text: formatError(err) })
    }
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

            {nextStatus[row.status] && (
              <Button
                variant="outline"
                onClick={() => handleStatusUpdate(row.id, nextStatus[row.status]!.status)}
                className="!px-3 !py-1.5 !text-xs"
                disabled={isUpdating}
              >
                {isUpdating ? '...' : nextStatus[row.status]!.label}
              </Button>
            )}
            {row.status === 'PREPARING' && (
              <>
                <select
                  aria-label={`Pilih kurir untuk ${row.id}`}
                  value={courierByOrder[row.id] ?? ''}
                  onChange={(event) => setCourierByOrder((value) => ({ ...value, [row.id]: event.target.value }))}
                  className="max-w-28 rounded border border-[#DCD9D5] px-2 py-1 text-xs"
                >
                  <option value="">Pilih kurir</option>
                  {couriers.map((courier) => <option key={courier.id} value={courier.id}>{courier.name}</option>)}
                </select>
                <Button onClick={() => handleAssignCourier(row.id)} className="!px-3 !py-1.5 !text-xs" disabled={!courierByOrder[row.id] || isUpdating}>
                  Assign
                </Button>
              </>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <PageContainer>
      <PageHeader
        title="Order Management"
        subtitle="Manage and track deliveries"
      />

      <Card padding={false}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 md:px-6 py-4 md:py-5 border-b border-[#DCD9D5]">
          <span className="text-sm font-semibold text-[#2D2D2D]">Orders</span>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Icon icon="mdi:magnify" width={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7F7E77]" />
              <FormInput
                name="search"
                value={search}
                type="text"
                onChange={e => setSearch(e.target.value)}
                placeholder="Search order..."
                className="w-full rounded-lg border border-[#DCD9D5] bg-transparent pl-9 pr-4 py-2 text-sm text-[#2D2D2D] outline-none focus:border-[#BD6230] transition-colors placeholder:text-[#7F7E77]/60"
              />
            </div>
            <div className="w-full sm:w-44">
              <Select
                options={STATUS_OPTIONS as unknown as { label: string; value: string }[]}
                label=""
                name="delivery"
                value={statusFilter}
                onChange={setStatusFilter}
              />
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {loading ? <AnimationLogin /> : <Table columns={columns} data={filteredData} />}
        </div>
      </Card>
    </PageContainer>
  )
}
