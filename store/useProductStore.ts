import { showNotify } from '@/components/Base/notification/notify-controllers';
import { addProduct, getProduct, getProductById } from '@/pages/api/product/productApi';
import { ProductRequest, ProductResponse, ProductResponseById } from '@/types/product';
import { formatError } from '@/utils/formatError';
import { create } from 'zustand';

interface ProductState {
    products: ProductResponse[];
    productsById: ProductResponseById,
    // pagination state
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    productsId?: string;

    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    setProductsId: (id?: string) => void;

    search: string;
    error: string | null;
    loading: boolean;

    getProduct: () => Promise<void>;
    getProductByIds: (id?: string) => Promise<void>
    addProducts: (product: ProductRequest) => Promise<void>;
    removeProduct: (index: number) => void;
    updateProduct: (index: string, updateProduct: ProductRequest) => void;
    decreaseStock: (id: string) => void;
    resetProductById: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
    search: '',
    products: [],
    productsById: {},
    error: null,

    // pagination default
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    loading: false,
    productsId: '',

    setPage: (page) => set({ page }),
    setProductsId: (productsId) => set({ productsId }),
    setLimit: (limit) => set({ limit, page: 1 }),

    getProduct: async () => {
        const { page, limit } = get();
        set({ loading: true })
        try {
            const res = await getProduct({
                page,
                limit,
            });
            const pagination = res.data.meta
            set({ loading: false })
            set({
                products: res.data.data,
                total: pagination.total,
                totalPages: pagination.totalPages,
            });
        } catch (err: unknown) {
            const message = formatError(err) || 'Error get Product';
            set({ error: message });
            set({ loading: false })
            throw new Error(message);
        }
    },

    getProductByIds: async (id?: string) => {
        const { productsId } = get()
        if (!productsId) return

        set({ loading: true })
        
        try {
            const res = await getProductById(productsId as string)
            set({ productsById: res.data})
        } catch (err: unknown) {
            const message = formatError(err) || 'Error get product by id'
            set({ error: message })
            set({ loading: false })
            throw new Error(message)
        } finally {
            set({ loading: false })
        }

    },

    addProducts: async (prd) => {
        set({ loading: true })

        try {
            await addProduct(prd);

            await get().getProduct();

            set({ loading: false })
            showNotify({
                type: 'success',
                title: 'Sukses',
                text: 'Tambah Produk Berhasil',
            });
        } catch (err: unknown) {
            const message = formatError(err) || 'Error Add Product';
            set({ error: message });
            set({ loading: false })
            showNotify({
                type: 'error',
                title: 'Gagal',
                text: message,
            });

            throw new Error(message);
        }
    },

    removeProduct: (idx) => {
        set((state) => ({
            products: state.products.filter((_, i) => i !== idx),
        }));
    },

    updateProduct: (id: string, updt) => {
        // set((state) => ({
        //     products: state.products.map((item, i) =>
        //         i === idx ? (updt as ProductResponse) : item
        //     ),
        // }));
    },

    decreaseStock(id) {
        set((state) => ({
            products: state.products.map((p) =>
                p.id === id ? {...p, stock: p.stock - 1}: p
            )
        }))
    },
    
    resetProductById: () => set({productsById: {}})
}));
