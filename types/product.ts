export type RoastLevel = 'MEDIUM' | 'LIGHT' | 'DARK'

export interface Product {
    id: number,
    name: string,
    description: string,
    roast_level: RoastLevel,
    title?: string,
    sec_title?: string,
    price: number,
    image_url: string,
    stock: number
}

export interface ProductRequest extends Product {
    origin: string,
    process: string,
    flavor_notes: string
}