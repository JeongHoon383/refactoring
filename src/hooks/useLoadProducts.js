import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/api/product";
import useProductStore from "../store/product/productsSlice";

export const useLoadProducts = ({ filter, pageSize, page, isInitial }) => {
  const { setProducts, setLoading, setError } = useProductStore();

  return useQuery({
    queryKey: [["products"], filter, pageSize, page], // queryKey는 객체 내부에 배열로 전달
    queryFn: () => {
      return fetchProducts(filter, pageSize, page);
    },
    onSuccess: (data) => {
      console.log(data);
      setProducts(data.products, data.hasNextPage, data.totalCount, isInitial);
    },
    onError: (error) => {
      console.error("Error in useQuery:", error);
      setError(error.message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};
