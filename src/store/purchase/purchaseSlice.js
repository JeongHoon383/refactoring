import { create } from "zustand";
import { devtools } from "zustand/middleware";

const usePurchaseStore = create(
  devtools((set) => ({
    isLoading: false,
    error: null,

    // 구매 시작
    purchaseStart: () => set({ isLoading: true, error: null }),

    // 구매 성공
    purchaseSuccess: () => set({ isLoading: false, error: null }),

    // 구매 실패
    purchaseFailure: (error) => set({ isLoading: false, error }),
  }))
);

export default usePurchaseStore;
