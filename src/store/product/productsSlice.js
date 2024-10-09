import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useProductStore = create(
  devtools((set) => ({
    items: [],
    hasNextPage: true,
    isLoading: false,
    error: null,
    totalCount: 0,

    // 상태 업데이트 함수들
    setLoading: (loading) => set({ isLoading: loading }),
    setProducts: (products, hasNextPage, totalCount, isInitial) =>
      set((state) => ({
        items: isInitial ? products : [...state.items, ...products],
        hasNextPage,
        totalCount,
        isLoading: false,
        error: null,
      })),
    setError: (error) => set({ isLoading: false, error }),

    // 새 상품 추가
    addProduct: (product) =>
      set((state) => ({
        items: [product, ...state.items],
        totalCount: state.totalCount + 1,
        isLoading: false,
        error: null,
      })),
  }))
);

export default useProductStore;
