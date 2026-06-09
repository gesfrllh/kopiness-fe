export type DeliveryStatus = "IN_PROGRESS" | "DELIVERED"

export interface Order {
  id: string
  customer: string
  customerPhone?: string
  status: string
  deliveryStatus: DeliveryStatus
  total: number
  createdAt?: string
}
