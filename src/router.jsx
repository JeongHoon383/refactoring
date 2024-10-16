import React from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";

import { pageRoutes } from "@/apiRoutes";
import { Cart } from "@/pages/cart";
import { RootErrorBoundary } from "@/pages/common/components/RootErrorHandler";
import { RootSuspense } from "@/pages/common/components/RootSuspense";
import { ErrorPage } from "@/pages/error/components/ErrorPage";
import { NotFoundPage } from "@/pages/error/components/NotFoundPage";
import { Home } from "@/pages/home";
import { LoginPage } from "@/pages/login";
import { Purchase } from "@/pages/purchase";
import { RegisterPage } from "@/pages/register";
import Toast from "@/components/ui/Toast";

const CommonLayout = () => (
  <RootErrorBoundary>
    <RootSuspense>
      <Outlet />
      <Toast />
    </RootSuspense>
  </RootErrorBoundary>
);

const router = createBrowserRouter([
  {
    element: <CommonLayout />,
    children: [
      { path: pageRoutes.main, element: <Home />, errorElement: <ErrorPage /> },
      {
        path: pageRoutes.register,
        element: <RegisterPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: pageRoutes.login,
        element: <LoginPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: pageRoutes.cart,
        element: <Cart />,
        errorElement: <ErrorPage />,
      },
      {
        path: pageRoutes.purchase,
        element: <Purchase />,
        errorElement: <ErrorPage />,
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default router;
