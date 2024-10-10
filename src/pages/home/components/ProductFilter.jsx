import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

import { ApiErrorBoundary } from "@/pages/common/components/ApiErrorBoundary";
import useFilterStore from "@/store/filter/filterSlice"; // Zustand에서 필터 상태 가져오기
import { debounce } from "@/utils/common";
import React from "react";
import { CategoryRadioGroup } from "./CategoryRadioGroup";
import { PriceRange } from "./PriceRange";
import { SearchBar } from "./SearchBar";

const ProductFilterBox = ({ children }) => (
  <Card className="my-4">
    <CardContent>{children}</CardContent>
  </Card>
);

export const ProductFilter = () => {
  const {
    setMinPrice,
    setMaxPrice,
    setTitle,
    setCategoryId,
    filterState, // 필터 상태
  } = useFilterStore(); // Zustand로 필터 상태 및 액션 함수 구독

  const handleChangeInput = debounce((e) => {
    setTitle(e.target.value); // 제목 필터 업데이트
  }, 300);

  const handlePriceChange = (actionCreator) =>
    debounce((e) => {
      const value = e.target.value;
      if (value === "") {
        actionCreator(-1); // 값이 없으면 -1로 설정
      } else {
        const numericValue = Math.max(0, parseInt(value, 10));
        if (!isNaN(numericValue)) {
          actionCreator(numericValue); // 가격 필터 업데이트
        }
      }
    }, 300);

  const handleMinPrice = handlePriceChange(setMinPrice);
  const handleMaxPrice = handlePriceChange(setMaxPrice);

  const handleChangeCategory = (value) => {
    if (value !== undefined) {
      setCategoryId(value); // 카테고리 필터 업데이트
      console.log("Category changed to:", value);
    } else {
      console.error("카테고리가 설정되지 않았습니다.");
    }
  };

  return (
    <div className="space-y-4">
      <ProductFilterBox>
        <SearchBar onChangeInput={handleChangeInput} />
      </ProductFilterBox>
      <ProductFilterBox>
        <ApiErrorBoundary>
          <Suspense fallback={<Loader2 className="h-24 w-24 animate-spin" />}>
            <CategoryRadioGroup
              categoryId={filterState.categoryId || ALL_CATEGORY_ID} // 필터 상태에서 카테고리 ID 사용
              onChangeCategory={handleChangeCategory}
            />
          </Suspense>
        </ApiErrorBoundary>
      </ProductFilterBox>
      <ProductFilterBox>
        <PriceRange
          onChangeMinPrice={handleMinPrice}
          onChangeMaxPrice={handleMaxPrice}
        />
      </ProductFilterBox>
    </div>
  );
};
