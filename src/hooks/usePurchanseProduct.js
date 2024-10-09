import { useMutation } from "@tanstack/react-query";
import { makePurchaseAPI } from "@/api/purchase";
import usePurchaseStore from "@/store/purchase/purchaseSlice";

export const usePurchaseProduct = () => {
  const { purchaseStart, purchaseSuccess, purchaseFailure } =
    usePurchaseStore();

  return useMutation((purchaseData) => makePurchaseAPI(purchaseData), {
    onMutate: () => {
      purchaseStart(); // 구매 시작
    },
    onSuccess: () => {
      purchaseSuccess(); // 구매 성공
    },
    onError: (error) => {
      purchaseFailure(error.message || "구매에 실패하였습니다."); // 구매 실패 처리
    },
  });
};
