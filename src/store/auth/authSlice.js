import { create } from "zustand";
import { useMutation } from "@tanstack/react-query";
import { registerUserAPI } from "@/api/auth";

const useAuthStore = create((set) => ({
  isLogin: false,
  user: null,
  registerStatus: "idle",
  registerError: null,

  // 상태 변경 함수
  setIsLogin: (isLogin) => set({ isLogin }),
  setUser: (user) => set({ user, isLogin: true }),
  logout: () => set({ isLogin: false, user: null }),

  // 비동기 요청 처리 함수
  registerUser: async (email, password, name) => {
    set({ registerStatus: "loading" });
    try {
      const user = await registerUserAPI(email, password, name);
      set({ user, isLogin: true, registerStatus: "succeeded" });
    } catch (error) {
      set({
        registerStatus: "failed",
        registerError: error.message || "Registration failed",
      });
    }
  },
}));

export default useAuthStore;
