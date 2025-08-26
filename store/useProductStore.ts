import { Product } from '@/types/product';
import { create } from 'zustand';

interface ProductState {
    products: Product[];
    addProduct: (product: Product) => void;
    removeProduct: (index: number) => void;
    updateProduct: (index: number, updateProduct: Product) => void;
}

export const useProductStore = create<ProductState>((set) => ({
    products: [
        {
            title: 'Arabican Coffee Beans',
            desc: 'Known for their smooth taste and delicate aroma, Arabica coffee beans are among the most popular coffee varieties in the world. They offer a naturally mild flavor with subtle hints of sweetness, floral notes, and a touch of fruitiness. Perfect for brewing a clean, balanced cup, Arabica beans are ideal for those who enjoy a refined and aromatic coffee experience.',
            image: '/assets/image/beans1.jpg',
            price: 100000,
        },
        {
            title: 'Produk Baru',
            desc: 'Deskripsi produk',
            image: '/assets/image/beans2.jpg',
            price: 100000,
        },
        {
            title: 'Produk Baru',
            desc: 'Deskripsi produk',
            image: '/assets/image/beans3.jpg',
            price: 100000,
        },
        {
            title: 'Produk Baru',
            desc: 'Deskripsi produk',
            image: '/assets/image/beans4.jpg',
            price: 100000,
        }
    ],

    addProduct: (prd) => {
        set((state) => ({
            products: [...state.products, prd]
        }))
    },

    removeProduct: (idx) => {
        set((state) => ({
            products: state.products.filter((_, i) => i !== idx)
        }))
    },

    updateProduct: (idx, updt) => {
        set((state) => ({
            products: state.products.map((item, i) =>
                i === idx ? updt : item
            )
        }))
    }
}))