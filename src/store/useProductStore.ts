import { create } from 'zustand';
import axios from 'axios';
import { ProductTypes, ProductApiResponse } from '@/types/Product';
import {
  CREATE_PRODUCT_API,
  DELETE_PRODUCT_API,
  DELETE_ALL_PRODUCTS_API,
  DESTROY_PRODUCT_API,
  DESTROY_ALL_PRODUCTS_API,
  GET_PRODUCT_API,
  GET_ALL_PRODUCTS_API,
  UPDATE_PRODUCT_API,
  RESTORE_PRODUCT_API,
  RESTORE_ALL_PRODUCTS_API,
} from '@/app/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useStatusStore } from '@/store/useStatusStore';

interface ProductState {
  product: ProductTypes | null;
  all_products: ProductTypes[];
  fetchAllProducts: () => Promise<void>;
  fetchProduct: (id: number) => Promise<void>;
  createProduct: (productData: Partial<ProductTypes>) => Promise<void>;
  updateProduct: (id: number, productData: Partial<ProductTypes>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  deleteAllProducts: () => Promise<void>;
  destroyProduct: (id: number) => Promise<void>;
  destroyAllProducts: () => Promise<void>;
  restoreProduct: (id: number) => Promise<void>;
  restoreAllProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  product: null,
  all_products: [],

  fetchAllProducts: async () => {
    const { setError } = useStatusStore.getState();
    setError(null);

    try {
      const response = await axios.get<ProductApiResponse<ProductTypes[]>>(GET_ALL_PRODUCTS_API);
      set({ all_products: response.data.data || [] });
    } catch (error) {
      set({ all_products: [] });
      setError("Failed to fetch products");
    }
  },

  fetchProduct: async (id) => {
    const { setError } = useStatusStore.getState();
    setError(null);
    const token = useAuthStore.getState().token;

    try {
      const response = await axios.get<ProductApiResponse<ProductTypes>>(`${GET_PRODUCT_API}/${id}`, {
        headers: { Authorization: `Token ${token}` },
      });
      set({ product: response.data.data });
    } catch (error) {
      setError("Failed to fetch product");
    }
  },

  createProduct: async (productData) => {
    const { setError } = useStatusStore.getState();
    setError(null);
    const token = useAuthStore.getState().token;

    try {
      const response = await axios.post<ProductApiResponse<ProductTypes>>(CREATE_PRODUCT_API, productData, {
        headers: { Authorization: `Token ${token}` },
      });

      set((state) => ({
        all_products: [...state.all_products, response.data.data],
      }));
    } catch (error) {
      setError("Failed to create product");
    }
  },

  updateProduct: async (id, productData) => {
    const { setError } = useStatusStore.getState();
    setError(null);
    const token = useAuthStore.getState().token;

    try {
      const response = await axios.put<ProductApiResponse<ProductTypes>>(`${UPDATE_PRODUCT_API}/${id}`, productData, {
        headers: { Authorization: `Token ${token}` },
      });

      set((state) => ({
        all_products: state.all_products.map((product) =>
          product.id === id ? response.data.data : product
        ),
      }));
    } catch (error) {
      setError("Failed to update product");
    }
  },

  deleteProduct: async (id) => {
    const { setError } = useStatusStore.getState();
    setError(null);
    const token = useAuthStore.getState().token;

    try {
      await axios.delete(`${DELETE_PRODUCT_API}/${id}`, {
        headers: { Authorization: `Token ${token}` },
      });

      set((state) => ({
        all_products: state.all_products.filter((product) => product.id !== id),
      }));
    } catch (error) {
      setError("Failed to delete product");
    }
  },

  deleteAllProducts: async () => {
    const { setError } = useStatusStore.getState();
    setError(null);
    const token = useAuthStore.getState().token;

    try {
      await axios.delete(DELETE_ALL_PRODUCTS_API, {
        headers: { Authorization: `Token ${token}` },
      });

      set({ all_products: [] });
    } catch (error) {
      setError("Failed to delete all products");
    }
  },

  destroyProduct: async (id) => {
    const { setError } = useStatusStore.getState();
    setError(null);
    const token = useAuthStore.getState().token;

    try {
      await axios.delete(`${DESTROY_PRODUCT_API}/${id}`, {
        headers: { Authorization: `Token ${token}` },
      });

      set((state) => ({
        all_products: state.all_products.filter((product) => product.id !== id),
      }));
    } catch (error) {
      setError("Failed to permanently delete product");
    }
  },

  destroyAllProducts: async () => {
    const { setError } = useStatusStore.getState();
    setError(null);
    const token = useAuthStore.getState().token;

    try {
      await axios.delete(DESTROY_ALL_PRODUCTS_API, {
        headers: { Authorization: `Token ${token}` },
      });

      set({ all_products: [] });
    } catch (error) {
      setError("Failed to permanently delete all products");
    }
  },

  restoreProduct: async (id) => {
    const { setError } = useStatusStore.getState();
    setError(null);
    const token = useAuthStore.getState().token;

    try {
      const response = await axios.put<ProductApiResponse<ProductTypes>>(`${RESTORE_PRODUCT_API}/${id}`, {}, {
        headers: { Authorization: `Token ${token}` },
      });

      set((state) => ({
        all_products: [...state.all_products, response.data.data],
      }));
    } catch (error) {
      setError("Failed to restore product");
    }
  },

  restoreAllProducts: async () => {
    const { setError } = useStatusStore.getState();
    setError(null);
    const token = useAuthStore.getState().token;

    try {
      const response = await axios.put<ProductApiResponse<ProductTypes[]>>(RESTORE_ALL_PRODUCTS_API, {}, {
        headers: { Authorization: `Token ${token}` },
      });

      set({ all_products: response.data.data });
    } catch (error) {
      setError("Failed to restore all products");
    }
  },
}));
