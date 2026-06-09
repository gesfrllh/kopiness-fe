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
} from '@/lib/api/productApi';
import { addCartItem } from '@/lib/api/cart';

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

    storeId: string;
    setStoreId: (id: string) => void;
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
    storeId: '',
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    loading: false,
    productsId: '',
    modalDetail: false,

    setStoreId: (storeId) => set({ storeId }),
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
        set({ loading: true })
        const { draftQty } = get()
        const entries = Object.entries(draftQty).filter(([, quantity]) => quantity > 0)

        try {
            for (const [productId, quantity] of entries) {
                await addCartItem(productId, quantity)
            }
            set({ loading: false })
            await get().getProduct()
            showNotify({
                type: 'success',
                title: 'Sukses',
                text: 'Produk berhasil ditambahkan ke keranjang',
            });
        } catch (err) {
            const message = formatError(err) || 'Error submit data';
            set({ error: message });
            set({ loading: false })
            showNotify({
                type: 'error',
                title: 'Gagal',
                text: message,
            });
            throw new Error(message);
        }

        set({ draftQty: {} })
    },

    getProduct: async () => {
        const { page, limit, storeId } = get();
        set({ loading: true })
        try {
            const res = await getProduct({
                page,
                limit,
                store_id: storeId || undefined,
            });
            set({ loading: false })
            set({
                products: res.data,
                total: res.meta.total,
                totalPages: res.meta.totalPages,
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
            set({ productsById: res })
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
        const { storeId } = get()
        const payload = storeId && !prd.store_id ? { ...prd, store_id: storeId } : prd

        try {
            await addProduct(payload);

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
        const { storeId } = get()
        const payload = storeId && !updt.store_id ? { ...updt, store_id: storeId } : updt

        try {
            await editProduct(id, payload)

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
