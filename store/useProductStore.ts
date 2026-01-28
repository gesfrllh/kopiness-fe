import { showNotify } from '@/components/Base/notification/notify-controllers';
import { create } from 'zustand';
import { formatError } from '@/utils/formatError';
import {
    ProductRequest,
    ProductResponse,
    ProductResponseById
} from '@/types/product';
import {
    addProduct,
    deleteProduct,
    editProduct,
    getProduct,
    getProductById
} from '@/pages/api/product/productApi';

interface ProductState {
    products: ProductResponse[];
    draftQty: Record<string, number>,
    productsById: ProductResponseById,
    // pagination state
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    productsId?: string;
    modalDetail: boolean;

    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    setProductsId: (id?: string) => void;

    search: string;
    error: string | null;
    loading: boolean;

    updateDraftStock: (id: string, delta: number) => void;
    getDisplayQty: (product: ProductResponse) => number;
    commitStockChanges: () => Promise<void>;
    getProduct: () => Promise<void>;
    getProductByIds: (id?: string) => Promise<void>
    addProducts: (product: ProductRequest) => Promise<void>;
    removeProduct: (id: string) => void;
    getDisplayStock: (product: ProductResponse) => number;
    updateProduct: (index: string, updateProduct: ProductRequest) => void;
    decreaseStock: (id: string) => void;
    resetProductById: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
    search: '',
    products: [],
    productsById: { id: '' },
    error: null,
    draftQty: {},

    // pagination default
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    loading: false,
    productsId: '',
    modalDetail: false,

    setPage: (page) => set({ page }),
    setProductsId: (productsId) => set({ productsId }),
    setLimit: (limit) => set({ limit, page: 1 }),

    updateDraftStock: (id, delta) => {
        set((state) => {
            const current = state.draftQty[id] ?? 0
            const product = state.products.find((p) => p.id === id)

            if (!product) return state

            const nextQty = Math.max(
                0,
                Math.min(current + delta, product.stock)
            )

            return {
                draftQty: {
                    ...state.draftQty,
                    [id]: nextQty,
                },
            }
        })
    },

    getDisplayQty: (product: ProductResponse) => {
        return get().draftQty[product.id as string] ?? 0
    },

    getDisplayStock: (product) => {
        const draft = get().draftQty[product.id as string] ?? 0
        return Math.max(product.stock - draft, 0)
    },

    commitStockChanges: async () => {
        const { draftQty } = get()
        const payload = Object.entries(draftQty).filter(([, qty]) => qty > 0).map(([productId, qty]) => ({
            productId,
            qty
        }))

        // console.log(payload)

        set({ draftQty: {} })
    },

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

    getProductByIds: async () => {
        const { productsId } = get()
        if (!productsId) return

        set({ loading: true })

        try {
            const res = await getProductById(productsId as string)
            set({ productsById: res.data })
            set({ loading: false })
            return res
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

    removeProduct: async (id: string) => {
        set({ loading: true })

        try {
            await deleteProduct(id)

            set({ loading: false })
            showNotify({
                type: 'success',
                title: 'Sukses',
                text: 'Data Berhasi dihapus'
            })

            await get().getProduct()
        } catch (err) {
            const message = formatError(err) || 'Error Menghapus data'
            set({ error: message })
            showNotify({
                type: 'error',
                title: 'Gagal',
                text: message
            })
        } finally {
            set({ loading: false })
        }
    },

    updateProduct: async (id: string, updt) => {
        set({ loading: true })

        try {
            await editProduct(id, updt)

            set({ loading: false })
            showNotify({
                type: 'success',
                title: 'Sukses',
                text: 'Data Berhasil diperbarui'
            })
        } catch (err) {
            const message = formatError(err) || 'Error Edit Product'
            set({ error: message })
            showNotify({
                type: 'error',
                title: 'Gagal',
                text: message
            })
        } finally {
            set({ loading: false })
        }
    },
    decreaseStock(id) {
        set((state) => ({
            products: state.products.map((p) =>
                p.id === id ? { ...p, stock: p.stock - 1 } : p
            )
        }))
    },

    resetProductById: () => set({ productsById: { id: '' } }),
}));
