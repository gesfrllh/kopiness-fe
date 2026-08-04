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
    flavor_notes?: string,
    store_id?: string
}

export interface ProductResponse extends Omit<Product, 'image_url' | 'sec_title' | 'roast_level' | 'flavor_notes'> {
    roastLevel: RoastLevel
    secTitle: string,
    imageUrl: string[],
    origin: string,
    process: string,
    flavorNotes: string,
    store_id?: string
}

export type ProductResponseById = Pick<ProductResponse, 'id'> & Partial<Omit<ProductResponse, 'id'>>

export interface CartItem extends ProductResponse {
    qty: number
}
export interface CartState {
    items: CartItem[]
    totalQty: number

    addToCart: (product: ProductResponse) => Promise<void>;
    updateItemQty: (productId: string, quantity: number) => Promise<void>
    removeFromCart: (ids: string | string[]) => Promise<void>
    clearCart: () => Promise<void>
    fetchCart: () => Promise<void>
}

export type CartPayload = {
    productId: string,
    quantity: number
}
export interface CartRequest {
    items: CartPayload[]
}   
