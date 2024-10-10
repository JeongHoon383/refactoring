import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addProductAPI } from "@/api/product";
import useProductStore from "../store/product/productsSlice";
import { fetchProducts } from "../api/product";
import { useInfiniteQuery } from "@tanstack/react-query";

// React Query의 useMutation 훅과 QueryClient를 가져오고, addProductAPI와 Zustand의 상태 관리 함수들을 가져옴
export const useAddProduct = () => {
  const queryClient = useQueryClient(); // QueryClient를 사용하여 캐싱된 쿼리 데이터를 관리함
  const { addProduct, setLoading, setError } = useProductStore(); // Zustand에서 상태 관리 함수들 가져오기 (addProduct, setLoading, setError)

  // useMutation 훅을 사용하여 제품 추가 비동기 작업을 처리하는 함수 반환
  return useMutation({
    mutationFn: addProductAPI, // mutation 함수로 addProductAPI를 사용하여 서버에 제품 데이터를 추가
    onMutate: async () => {
      setLoading(true); // mutation이 시작되기 직전에 로딩 상태를 true로 설정하여 로딩 스피너 등을 표시
    },
    onSuccess: (newProduct) => {
      addProduct(newProduct); // 서버에서 새로 추가된 제품 데이터를 받아와서 Zustand의 로컬 상태에 제품을 추가
      queryClient.invalidateQueries("products"); // "products" 쿼리를 무효화하여 서버에서 최신 제품 목록을 다시 불러옴
    },
    onError: (error) => {
      setError(error.message || "상품 등록에 실패하였습니다."); // 오류 발생 시 오류 메시지를 Zustand 상태에 설정하여 에러 처리
    },
    onSettled: () => {
      setLoading(false); // mutation이 성공하거나 실패한 후 항상 로딩 상태를 false로 설정하여 로딩 상태 종료
    },
  });
};

export const useLoadProducts = ({ filter, pageSize }) => {
  return useInfiniteQuery(
    ["products", filter], // queryKey에 필터 상태 포함 (필터별로 캐시 관리)
    ({ pageParam = 1 }) => fetchProducts(filter, pageSize, pageParam), // fetchProducts 함수로 API 요청
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.hasNextPage ? allPages.length + 1 : undefined; // 다음 페이지가 있으면 반환
      },
      keepPreviousData: true, // 새 데이터를 불러올 때 이전 데이터를 유지
      staleTime: 5000, // 데이터가 "오래된 상태"로 간주되기 전까지의 시간 (캐싱 최적화)
    }
  );
};
// 저장된 데이터 호출

// API 함수 호출
// 받은 데이터를 API 에서 firebase로 데이터 저장
// 저장된 데이터 호출
