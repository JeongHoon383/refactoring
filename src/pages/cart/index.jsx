import { CartTable } from "@/pages/cart/components/CartTable";
import { EmptyNotice } from "@/pages/cart/components/EmptyNotice";
import { Layout, authStatusType } from "@/pages/common/components/Layout";
import useCartStore from "@/store/cart/cartSlice"; // Zustand에서 cart 상태 가져옴
import React from "react";

export const Cart = () => {
  const { cart } = useCartStore(); // Zustand에서 cart 상태 구독
  const isExist = cart.length > 0;

  return (
    <Layout
      className="p-2.5 flex flex-col"
      authStatus={authStatusType.NEED_LOGIN}
    >
      {isExist ? <CartTable /> : <EmptyNotice />}
    </Layout>
  );
};
