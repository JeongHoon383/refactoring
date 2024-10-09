import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { MAX_CART_VALUE } from "@/constants";
import { cartValidationMessages } from "@/messages";
import useCartStore from "@/store/cart/cartSlice"; // Zustand로 변경
import { formatPrice } from "@/utils/formatter";
import { Trash2 } from "lucide-react";
import React from "react";

export const ProductInfoTableRow = ({ item, user }) => {
  const { changeCartItemCount, removeCartItem } = useCartStore(); // Zustand로 상태 관리
  const { id, title, count, image, price } = item;

  const handleClickDeleteItem = () => {
    if (user) {
      removeCartItem({ itemId: id, userId: user.uid }); // 상태 업데이트
    }
  };

  const handleChangeCount = (e) => {
    const newCount = Number(e.target.value);

    if (newCount > MAX_CART_VALUE) {
      alert(cartValidationMessages.MAX_INPUT_VALUE);
      return;
    }

    if (user) {
      changeCartItemCount({ itemId: id, userId: user.uid, count: newCount }); // 상태 업데이트
    }
  };

  return (
    <TableRow>
      <TableCell className="text-center">
        <img src={image} height="80" alt={title} />
      </TableCell>
      <TableCell>{title}</TableCell>
      <TableCell>
        <Input
          type="number"
          onChange={handleChangeCount}
          value={count}
          className="w-20"
        />
      </TableCell>
      <TableCell>{formatPrice(price * count)}</TableCell>
      <TableCell>
        <Button variant="ghost" size="icon" onClick={handleClickDeleteItem}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
