import { create } from "zustand";

const useToastStore = create((set) => ({
  toasts: [],

  // Toast 추가
  addToast: (message, type = "success") => {
    const id = Date.now(); // 고유 ID 생성
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));

    // 일정 시간 후 Toast 자동 제거
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    }, 3000); // 3초 후 자동 삭제
  },

  // Toast 수동 제거
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toast.filter((toast) => toast.id !== id),
    }));
  },
}));

export default useToastStore;
