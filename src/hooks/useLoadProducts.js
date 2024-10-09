import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/api/product";
import useProductStore from "../store/product/productsSlice";

export const useLoadProducts = (filter, pageSize, page, isInitial) => {
  const { setProducts, setLoading, setError } = useProductStore();

  return useQuery({
    queryKey: ["products", filter, pageSize, page], // queryKey는 객체 내부에 배열로 전달
    queryFn: () => {
      console.log("useQuery called", filter, pageSize, page);
      const result = fetchProducts(filter, pageSize, page);
      console.log("Result from fetchProducts:", result);
      return result;
    }, // queryFn도 객체 내부에 전달
    onSuccess: (data) => {
      console.log("onSuccess called with data:", data);
      setProducts(data.products, data.hasNextPage, data.totalCount, isInitial);
    },
    onError: (error) => {
      console.log("Error fetching products: ", error);
      setError(error.message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};
