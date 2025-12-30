export type RoastLevel = 'MEDIUM' | 'LIGHT' | 'DARK'

export interface Product {
    id?: string,
    name: string,
    description: string,
    roast_level?: RoastLevel,
    title?: string,
    sec_title?: string,
    price: number,
    image_url?: string,
    stock: number
}

export interface ProductRequest extends Product {
    origin: string,
    process: string,
    flavor_notes?: string
}

export interface ProductResponse extends Omit<Product, 'image_url' | 'sec_title' | 'roast_level' | 'flavor_notes'> {
    roastLevel: RoastLevel
    secTitle: string,
    imageUrl: string[],
    origin: string,
    process: string,
    flavorNotes: string
}