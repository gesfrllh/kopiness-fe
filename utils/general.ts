export const formatCurrency = (val: number) => {
    const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(val)

    return formatted
}

export const Range = (start: number, end: number): number[] => {
    const length = end - start + 1 ;
    return Array.from({length}, (_, i) => start + i)
}

export const getImageSize = async(url: string) => {
    try {
        const res = await fetch(url, {method: 'HEAD'})
        const size = res.headers.get('content-length')
        if(!size) return ''
        return (Number(size) / 1024).toFixed(2)
    } catch {
        return ''
    }
}