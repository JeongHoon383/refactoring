import router from "@/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { useEffect } from "react";
import useAuthStore from "@/store/auth/authSlice";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      useErrorBoundary: true,
    },
    mutations: {
      // mutation 기본 옵션 설정
    },
  },
});

const isDevEnvironment = import.meta.env.DEV;

const Main = () => {
  const checkLogin = useAuthStore((state) => state.checkLogin);

  // 페이지 로드 시 로그인 상태 확인
  useEffect(() => {
    checkLogin(); // 앱 로드 시 로그인 상태 확인
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {isDevEnvironment && <ReactQueryDevtools />}
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);
