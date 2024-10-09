import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProductAPI } from "@/api/product";
import useProductStore from "../store/product/productsSlice";

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  const { addProduct, setLoading, setError } = useProductStore();

  return useMutation({
    mutationFn: addProductAPI, // 함수 형태로 전달
    onMutate: async () => {
      setLoading(true);
    },
    onSuccess: (newProduct) => {
      addProduct(newProduct); // 로컬 상태에 제품 추가
      queryClient.invalidateQueries("products"); // 쿼리 키를 갱신
    },
    onError: (error) => {
      setError(error.message || "상품 등록에 실패하였습니다.");
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};
