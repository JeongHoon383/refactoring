import { getItem, setItem } from "@/helpers/localStorage";
import { parseJSON } from "@/utils/common";

const CART_LOCAL_STORAGE_KEY = "CART_LOCAL_STORAGE_KEY";

// 로컬 스토리지에서 카트 데이터를 가져오는 함수
export const getCartFromLocalStorage = (userId) => {
  const cartData = getItem(CART_LOCAL_STORAGE_KEY);
  if (!cartData) {
    return [];
  }

  const cartItem = parseJSON(cartData) || null;
  return cartItem?.[userId] ?? [];
};

// 로컬 스토리지에서 특정 사용자의 카트를 초기화하는 함수
export const resetCartAtLocalStorage = (userId) => {
  const cartData = getItem(CART_LOCAL_STORAGE_KEY);
  const cartItem = cartData ? parseJSON(cartData) : {};

  setItem(CART_LOCAL_STORAGE_KEY, {
    ...cartItem,
    [userId]: [],
  });
};

// 카트 데이터를 로컬 스토리지에 저장하는 함수
export const setCartToLocalStorage = (cart, userId) => {
  const cartData = getItem(CART_LOCAL_STORAGE_KEY);
  const cartItem = cartData ? parseJSON(cartData) : {};

  setItem(CART_LOCAL_STORAGE_KEY, {
    ...cartItem,
    [userId]: cart,
  });
};

// 카트의 총 수량 및 가격을 계산하는 함수
export const calculateTotal = (cart) =>
  cart.reduce(
    (acc, item) => ({
      totalCount: acc.totalCount + item.count,
      totalPrice: acc.totalPrice + item.price * item.count,
    }),
    { totalCount: 0, totalPrice: 0 }
  );
