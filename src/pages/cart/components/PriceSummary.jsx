import { pageRoutes } from "@/apiRoutes";
import { Button } from "@/components/ui/button";
import useCartStore from "@/store/cart/cartSlice"; // Zustand에서 cart 상태 가져오기
import { formatNumber, formatPrice } from "@/utils/formatter";
import React from "react";
import { useNavigate } from "react-router-dom";

export const PriceSummary = () => {
  const navigate = useNavigate();
  const { totalCount, totalPrice } = useCartStore(); // Zustand에서 totalCount, totalPrice 구독

  const handleClickPurchase = () => {
    navigate(pageRoutes.purchase);
  };

  return (
    <div className="pt-4 flex flex-col items-end">
      <p>
        총 {formatNumber(totalCount)}개, {formatPrice(totalPrice)}
      </p>
      <Button onClick={handleClickPurchase} className="mt-2">
        구매하기
      </Button>
    </div>
  );
};
