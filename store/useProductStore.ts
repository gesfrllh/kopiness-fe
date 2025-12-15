import { Product } from '@/types/product';
import { create } from 'zustand';

interface ProductState {
    products: Product[];
    addProduct: (product: Product) => void;
    removeProduct: (index: number) => void;
    updateProduct: (index: number, updateProduct: Product) => void;
    search: string
}

export const useProductStore = create<ProductState>((set) => ({
    search: '',
    products: [
        {   
            id: 1,
            title: 'Arabican Coffee Beans',
            sec_title: 'Smooth, Refined, and Naturally Aromatic',
            desc: 'Known for their smooth taste and delicate aroma, Arabica coffee beans are among the most cherished coffee varieties in the world. Grown at high altitudes and nurtured in cool climates, Arabica offers a naturally mild flavor with subtle sweetness, floral notes, and a gentle fruitiness. Perfect for those who enjoy a clean, balanced cup, Arabica delivers a refined and aromatic coffee experience like no other.',
            image: '/assets/image/beans1.jpg',
            price: 100000,
        },
        {
            id: 2,
            title: 'Robusta Coffee Beans',
            sec_title: 'Bold, Strong, and Full of Character',
            desc: "Renowned for their intense flavor and high caffeine content, Robusta coffee beans deliver a bold and powerful coffee experience. With a naturally earthy, nutty taste and a rich crema when brewed as espresso, Robusta is perfect for those who prefer a strong, full-bodied cup with a pleasantly bitter kick. These beans thrive in lowland tropical climates and are ideal for blends, instant coffee, and traditional brews that pack a punch.",
            image: '/assets/image/beans2.jpg',
            price: 100000,
        },
        {
            id: 3,
            title: 'Liberica Coffee Beans',
            sec_title: 'Rare, Exotic, and Uniquely Aromatic',
            desc: "Liberica coffee offers a one-of-a-kind profile cherished by adventurous coffee lovers. Known for its large, irregular beans and distinct flavor, Liberica presents a smoky, woody aroma with hints of floral and fruity undertones. The taste is bold and complex — sometimes even wine-like — making it a true departure from conventional coffee. Ideal for those seeking something different, Liberica is a hidden gem waiting to be discovered.",
            image: '/assets/image/beans3.jpg',
            price: 100000,
        },
        {
            id: 4,
            title: 'Excelsa Coffee Beans',
            sec_title: 'Complex, Fruity, and Intriguingly Layered',
            desc: "Once classified as its own species, now recognized as a variety of Liberica, Excelsa coffee stands out with its unique combination of light body and tart, fruity notes. It brings a mysterious depth to any cup — often described as a blend between light, bright acidity and dark, roasted flavors. Frequently used in specialty blends to add complexity and lift, Excelsa is a rare bean that appeals to those who appreciate dynamic, evolving flavors in their coffee.",
            image: '/assets/image/beans4.jpg',
            price: 100000,
        },
        {   
            id: 1,
            title: 'Arabican Coffee Beans',
            sec_title: 'Smooth, Refined, and Naturally Aromatic',
            desc: 'Known for their smooth taste and delicate aroma, Arabica coffee beans are among the most cherished coffee varieties in the world. Grown at high altitudes and nurtured in cool climates, Arabica offers a naturally mild flavor with subtle sweetness, floral notes, and a gentle fruitiness. Perfect for those who enjoy a clean, balanced cup, Arabica delivers a refined and aromatic coffee experience like no other.',
            image: '/assets/image/beans1.jpg',
            price: 100000,
        },
        {
            id: 2,
            title: 'Robusta Coffee Beans',
            sec_title: 'Bold, Strong, and Full of Character',
            desc: "Renowned for their intense flavor and high caffeine content, Robusta coffee beans deliver a bold and powerful coffee experience. With a naturally earthy, nutty taste and a rich crema when brewed as espresso, Robusta is perfect for those who prefer a strong, full-bodied cup with a pleasantly bitter kick. These beans thrive in lowland tropical climates and are ideal for blends, instant coffee, and traditional brews that pack a punch.",
            image: '/assets/image/beans2.jpg',
            price: 100000,
        },
        {
            id: 3,
            title: 'Liberica Coffee Beans',
            sec_title: 'Rare, Exotic, and Uniquely Aromatic',
            desc: "Liberica coffee offers a one-of-a-kind profile cherished by adventurous coffee lovers. Known for its large, irregular beans and distinct flavor, Liberica presents a smoky, woody aroma with hints of floral and fruity undertones. The taste is bold and complex — sometimes even wine-like — making it a true departure from conventional coffee. Ideal for those seeking something different, Liberica is a hidden gem waiting to be discovered.",
            image: '/assets/image/beans3.jpg',
            price: 100000,
        },
        {
            id: 4,
            title: 'Excelsa Coffee Beans',
            sec_title: 'Complex, Fruity, and Intriguingly Layered',
            desc: "Once classified as its own species, now recognized as a variety of Liberica, Excelsa coffee stands out with its unique combination of light body and tart, fruity notes. It brings a mysterious depth to any cup — often described as a blend between light, bright acidity and dark, roasted flavors. Frequently used in specialty blends to add complexity and lift, Excelsa is a rare bean that appeals to those who appreciate dynamic, evolving flavors in their coffee.",
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