import { Button } from "@/components/ui/button";
import { ChevronDown, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { pageRoutes } from "@/apiRoutes";
import { PRODUCT_PAGE_SIZE } from "@/constants";
import { extractIndexLink, isFirebaseIndexError } from "@/helpers/error";
import { useModal } from "@/hooks/useModal";
import { FirebaseIndexErrorModal } from "@/pages/error/components/FirebaseIndexErrorModal";

// redux 바꿔야됨
import useAuthStore from "@/store/auth/authSlice"; // Zustand로 auth 상태 구독
import useCartStore from "@/store/cart/cartSlice"; // Zustand로 cart 상태 구독
import { useLoadProducts } from "../../../hooks/useAddProduct";
import { ProductCardSkeleton } from "../skeletons/ProductCardSkeleton";
import { EmptyProduct } from "./EmptyProduct";
import { ProductCard } from "./ProductCard";
import { ProductRegistrationModal } from "./ProductRegistrationModal";
import useProductStore from "../../../store/product/productsSlice";
import useFilterStore from "../../../store/filter/filterSlice";

export const ProductList = ({ pageSize = PRODUCT_PAGE_SIZE }) => {
  const navigate = useNavigate();
  const { isOpen, openModal, closeModal } = useModal();
  const [currentPage, setCurrentPage] = useState(1);
  const [isIndexErrorModalOpen, setIsIndexErrorModalOpen] = useState(false);
  const [indexLink, setIndexLink] = useState(null);

  const { user, isLogin } = useAuthStore(); // Zustand로 유저 상태 구독
  const { addCartItem } = useCartStore(); // 카트에 아이템 추가 함수
  const filter = useFilterStore((state) => state.filterState);

  // React Query로 서버에서 제품 데이터를 가져옴
  const { items, hasNextPage, isLoading, totalCount } = useProductStore();
  console.log(items);

  const loadProductsData = async (isInitial = false) => {
    try {
      const page = isInitial ? 1 : currentPage + 1;
      await useLoadProducts({
        filter,
        pageSize,
        page,
        isInitial,
      }).unwrap();
      if (!isInitial) {
        setCurrentPage(page);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (isFirebaseIndexError(errorMessage)) {
        const link = extractIndexLink(errorMessage);
        setIndexLink(link);
        setIsIndexErrorModalOpen(true);
      }
      throw error;
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    loadProductsData(true);
  }, [filter]);

  const handleCartAction = (product) => {
    if (isLogin && user) {
      const cartItem = { ...product, count: 1 };
      addCartItem({ item: cartItem, userId: user.uid, count: 1 });
      console.log(`${product.title} 상품이 \n장바구니에 담겼습니다.`);
    } else {
      navigate(pageRoutes.login);
    }
  };

  const handlePurchaseAction = (product) => {
    if (isLogin && user) {
      const cartItem = { ...product, count: 1 };
      addCartItem({ item: cartItem, userId: user.uid, count: 1 });
      navigate(pageRoutes.cart);
    } else {
      navigate(pageRoutes.login);
    }
  };

  const handleProductAdded = () => {
    setCurrentPage(1);
    loadProductsData(true);
  };

  const firstProductImage = items[0]?.image;

  useEffect(() => {
    if (firstProductImage) {
      const img = new Image();
      img.src = firstProductImage;
    }
  }, [firstProductImage]);

  // 이 코드는 UI 최적화를 위한 이미지 프리로딩(preloading) 방식으로, 사용자 경험을 개선하기 위한 패턴 중 하나입니다.

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end mt-4">
          {isLogin && (
            <Button onClick={openModal}>
              <Plus className="mr-2 h-4 w-4" /> 상품 등록
            </Button>
          )}
        </div>

        {isLoading && items.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: pageSize }, (_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyProduct onAddProduct={openModal} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((product, index) => (
                <ProductCard
                  key={`${product.id}_${index}`}
                  product={product}
                  onClickAddCartButton={(e) => {
                    e.stopPropagation();
                    handleCartAction(product);
                  }}
                  onClickPurchaseButton={(e) => {
                    e.stopPropagation();
                    handlePurchaseAction(product);
                  }}
                />
              ))}
            </div>
            {hasNextPage && currentPage * pageSize < totalCount && (
              <div className="flex justify-center mt-4">
                <Button onClick={() => loadProductsData()} disabled={isLoading}>
                  {isLoading ? "로딩 중..." : "더 보기"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}

        {isOpen && (
          <ProductRegistrationModal
            isOpen={isOpen}
            onClose={closeModal}
            onProductAdded={handleProductAdded}
          />
        )}
        <FirebaseIndexErrorModal
          isOpen={isIndexErrorModalOpen}
          onClose={() => setIsIndexErrorModalOpen(false)}
          indexLink={indexLink}
        />
      </div>
    </>
  );
};
