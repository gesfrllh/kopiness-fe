import { PaymentHistory } from "@/types/history";

export const formatCurrency = (val: number) => {
    const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(val)

    return formatted
}

export const Range = (start: number, end: number): number[] => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i)
}

export const getImageSize = async (url: string) => {
    try {
        const res = await fetch(url, { method: 'HEAD' })
        const size = res.headers.get('content-length')
        if (!size) return ''
        return (Number(size) / 1024).toFixed(2)
    } catch {
        return ''
    }
}

export const groupByMonth = (payments: PaymentHistory[]) => {
    return payments.reduce((acc, payment) => {
        const date = new Date(payment.createdAt)
        const key = date.toLocaleString('en-US', {
            month: 'long',
            year: 'numeric'
        })

        if (!acc[key]) acc[key] = []
        acc[key].push(payment)

        return acc
    }, {} as Record<string, PaymentHistory[]>)
}

export default function cleanPayload<T extends Record<string, unknown>>(obj: T): Partial<T> {
    const entries = Object.entries(obj).filter(
        ([_, v]) => v !== '' && v !== null && v !== undefined
    ) as [keyof T, T[keyof T]][]

    return Object.fromEntries(entries) as Partial<T>
}
