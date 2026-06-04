import { PaymentHistory, StepsTracking } from "@/types/history";

export const formatCurrency = (
    value: number = 0
) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value)
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

export type DateFormat =
    | 'short'      // 23 Feb 2026
    | 'long'       // 23 Februari 2026
    | 'withTime'   // 23 Feb 2026, 10:39
    | 'time'       // 10:39

export const formatDate = (
    date: string | Date,
    type: DateFormat = 'short'
) => {
    const d = typeof date === 'string' ? new Date(date) : date

    if (isNaN(d.getTime())) return '-'

    const locale = 'id-ID'

    switch (type) {
        case 'long':
            return d.toLocaleDateString(locale, {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            })

        case 'withTime':
            return d.toLocaleDateString(locale, {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })

        case 'time':
            return d.toLocaleTimeString(locale, {
                hour: '2-digit',
                minute: '2-digit',
            })

        default:
            return d.toLocaleDateString(locale, {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            })
    }
}

const stepOrder = [
    'CREATED',
    'PAYMENT_STARTED',
    'PAID',
    'CANCELLED',
]

export function hydrateTrackingSteps(steps: StepsTracking[], currentStatus: string) {
    const currentIndex = stepOrder.indexOf(currentStatus)

    return steps.map((step, idx) => {
        if (idx < currentIndex) {
            return {
                ...step,
                completed: true,
                active: false,
            }
        }

        if (idx === currentIndex) {
            return {
                ...step,
                active: true,
                completed: true,
            }
        }

        return {
            ...step,
            completed: false,
            active: false,
        }
    })
}