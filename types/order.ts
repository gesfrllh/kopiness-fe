export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "ACCEPTED"
  | "REJECTED"
  | "PREPARING"
  | "HANDED_TO_COURIER"
  | "ON_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"

export interface Order {
  id: string
  customer: string
  customerPhone?: string
  status: OrderStatus
  total: number
  createdAt?: string
}
