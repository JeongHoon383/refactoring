import { Button } from "@/components/ui/button";
import { ChevronDown, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { pageRoutes } from "@/apiRoutes";
import { PRODUCT_PAGE_SIZE } from "@/constants";
import { useModal } from "@/hooks/useModal";
import { FirebaseIndexErrorModal } from "@/pages/error/components/FirebaseIndexErrorModal";
import useAuthStore from "@/store/auth/authSlice"; // Zustand로 auth 상태 구독
import useCartStore from "@/store/cart/cartSlice"; // Zustand로 cart 상태 구독
import { useLoadProducts } from "@/hooks/useLoadProducts"; // TanStack Query로 제품 데이터 로드
import { ProductCardSkeleton } from "../skeletons/ProductCardSkeleton";
import { EmptyProduct } from "./EmptyProduct";
import { ProductCard } from "./ProductCard";
import { ProductRegistrationModal } from "./ProductRegistrationModal";
import useFilterStore from "../../../store/filter/filterSlice";

export const ProductList = ({ pageSize = PRODUCT_PAGE_SIZE }) => {
  const navigate = useNavigate();
  const { isOpen, openModal, closeModal } = useModal();
  const [currentPage, setCurrentPage] = useState(1);
  const [isIndexErrorModalOpen, setIsIndexErrorModalOpen] = useState(false);
  const [indexLink, setIndexLink] = useState(null);

  const filter = useFilterStore((state) => state.filterState); // 필터 상태 가져오기

  const {
    products = [],
    hasNextPage,
    isLoading,
    totalCount,
    refetch,
  } = useLoadProducts({
    filter,
    pageSize,
    page: currentPage,
    isInitial: true,
  }); // TanStack Query로 데이터 로드

  const { user, isLogin } = useAuthStore(); // Zustand로 유저 상태 구독
  const { addCartItem } = useCartStore(); // 카트에 아이템 추가 함수

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // loadProductsData 함수 추가: 상품 목록을 다시 불러오는 역할
  const loadProductsData = (isInitial = false) => {
    if (isInitial) {
      setCurrentPage(1); // 초기화 시 페이지를 1로 설정
    }
    refetch(); // TanStack Query에서 refetch로 데이터 다시 가져오기
  };

  const handleCartAction = (product) => {
    if (isLogin && user) {
      const cartItem = { ...product, count: 1 };
      addCartItem(cartItem, user.uid); // Zustand로 cart 상태 관리
      console.log(`${product.title} 상품이 \n장바구니에 담겼습니다.`);
    } else {
      navigate(pageRoutes.login);
    }
  };

  const handlePurchaseAction = (product) => {
    if (isLogin && user) {
      const cartItem = { ...product, count: 1 };
      addCartItem(cartItem, user.uid); // Zustand로 cart 상태 관리
      navigate(pageRoutes.cart);
    } else {
      navigate(pageRoutes.login);
    }
  };

  const handleProductAdded = () => {
    setCurrentPage(1);
    loadProductsData(true); // 상품 등록 후 데이터 다시 로드
  };

  const firstProductImage = products?.length > 0 ? products[0]?.image : null;

  useEffect(() => {
    if (firstProductImage) {
      const img = new Image();
      img.src = firstProductImage;
    }
  }, [firstProductImage]);

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

        {isLoading && products?.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: pageSize }, (_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : products?.length === 0 ? (
          <EmptyProduct onAddProduct={openModal} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products?.map((product, index) => (
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
                <Button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={isLoading}
                >
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
            onProductAdded={handleProductAdded} // 상품 등록 후 데이터 다시 로드
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
