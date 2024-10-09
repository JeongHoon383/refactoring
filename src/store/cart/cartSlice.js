import { create } from "zustand";
import {
  getCartFromLocalStorage,
  resetCartAtLocalStorage,
  setCartToLocalStorage,
  calculateTotal,
} from "./cartUtils";

// Zustand store 생성
const useCartStore = create((set) => ({
  cart: [],
  totalCount: 0,
  totalPrice: 0,

  // 초기 카트 설정
  initCart: (userId) => {
    if (!userId) return;
    const prevCartItems = getCartFromLocalStorage(userId);
    const total = calculateTotal(prevCartItems);
    set({
      cart: prevCartItems,
      totalCount: total.totalCount,
      totalPrice: total.totalPrice,
    });
  },

  // 카트 리셋
  resetCart: (userId) => {
    resetCartAtLocalStorage(userId);
    set({
      cart: [],
      totalCount: 0,
      totalPrice: 0,
    });
  },

  // 카트 항목 추가
  addCartItem: (item, userId, count = 1) => {
    set((state) => {
      const existingItemIndex = state.cart.findIndex(
        (cartItem) => cartItem.id === item.id
      );
      let updatedCart;
      if (existingItemIndex !== -1) {
        updatedCart = [...state.cart];
        updatedCart[existingItemIndex].count += count;
      } else {
        updatedCart = [...state.cart, { ...item, count }];
      }
      const total = calculateTotal(updatedCart);
      setCartToLocalStorage(updatedCart, userId);
      return {
        cart: updatedCart,
        totalCount: total.totalCount,
        totalPrice: total.totalPrice,
      };
    });
  },

  // 카트 항목 제거
  removeCartItem: (itemId, userId) => {
    set((state) => {
      const updatedCart = state.cart.filter((item) => item.id !== itemId);
      const total = calculateTotal(updatedCart);
      setCartToLocalStorage(updatedCart, userId);
      return {
        cart: updatedCart,
        totalCount: total.totalCount,
        totalPrice: total.totalPrice,
      };
    });
  },

  // 카트 항목 수량 변경
  changeCartItemCount: (itemId, count, userId) => {
    set((state) => {
      const itemIndex = state.cart.findIndex((item) => item.id === itemId);
      if (itemIndex !== -1) {
        const updatedCart = [...state.cart];
        updatedCart[itemIndex].count = count;
        const total = calculateTotal(updatedCart);
        setCartToLocalStorage(updatedCart, userId);
        return {
          cart: updatedCart,
          totalCount: total.totalCount,
          totalPrice: total.totalPrice,
        };
      }
    });
  },
}));

export default useCartStore;
