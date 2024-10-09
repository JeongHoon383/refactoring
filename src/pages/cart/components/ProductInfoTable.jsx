import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductInfoTableRow } from "@/pages/cart/components/ProductInfoTableRow";
import useCartStore from "@/store/cart/cartSlice"; // Zustant로부터 cart 상태 가져오기
import useAuthStore from "@/store/auth/authSlice"; // Zustant로부터 auth 상태 가져오기
import React from "react";

export const ProductInfoTable = () => {
  const { cart } = useCartStore(); // Zustant에서 cart 상태 구독
  const { user } = useAuthStore(); // Zustant에서 user 상태 구독

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">이미지</TableHead>
          <TableHead>상품명</TableHead>
          <TableHead>갯수</TableHead>
          <TableHead>가격</TableHead>
          <TableHead>삭제하기</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cart.map((item) => (
          <ProductInfoTableRow key={item.id} item={item} user={user} />
        ))}
      </TableBody>
    </Table>
  );
};
