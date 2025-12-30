import { showNotify } from '@/components/Base/notification/notify-controllers';
import { addProduct, getProduct } from '@/pages/api/product/productApi';
import { Product, ProductRequest, ProductResponse } from '@/types/product';
import { formatError } from '@/utils/formatError';
import { create } from 'zustand';

interface ProductState {
    products: ProductResponse[];

    // pagination state
    page: number;
    limit: number;
    total: number;
    totalPages: number;

    setPage: (page: number) => void;
    setLimit: (limit: number) => void;

    search: string;
    error: string | null;
    loading: boolean;

    getProduct: () => Promise<void>;
    addProducts: (product: ProductRequest) => Promise<void>;
    removeProduct: (index: number) => void;
    updateProduct: (index: number, updateProduct: ProductResponse) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
    search: '',
    products: [],
    error: null,

    // pagination default
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    loading: false,

    setPage: (page) => set({ page }),
    setLimit: (limit) => set({ limit, page: 1 }),

    getProduct: async () => {
        const { page, limit } = get();
        set({loading: true})
        try {
            const res = await getProduct({
                page,
                limit,
            });
            const pagination = res.data.meta
            set({loading: false})
            set({
                products: res.data.data,
                total: pagination.total,
                totalPages: pagination.totalPages,
            }); 
        } catch (err: unknown) {
            const message = formatError(err) || 'Error get Product';
            set({ error: message });
            set({loading: false})
            throw new Error(message);
        }
    },

    addProducts: async (prd) => {
        set({loading: true})

        try {
            await addProduct(prd);

            await get().getProduct();

            set({loading: false})
            showNotify({
                type: 'success',
                title: 'Sukses',
                text: 'Tambah Produk Berhasil',
            });
        } catch (err: unknown) {
            const message = formatError(err) || 'Error Add Product';
            set({ error: message });
            set({loading: false})
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

    updateProduct: (idx, updt) => {
        set((state) => ({
            products: state.products.map((item, i) =>
                i === idx ? (updt as ProductResponse) : item
            ),
        }));
    },
}));
