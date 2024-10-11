import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ALL_CATEGORY_ID, categories } from "@/constants";
import React from "react";
import { useForm } from "react-hook-form";
import { createNewProduct } from "@/helpers/product";
import { useAddProduct } from "@/hooks/useAddProduct"; // TanStack Query의 addProduct 훅 사용
import { uploadImage } from "@/utils/imageUpload";
import useToastStore from "@/store/toast/toast";

export const ProductRegistrationModal = ({
  isOpen,
  onClose,
  onProductAdded,
}) => {
  const addToast = useToastStore((state) => state.addToast);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      price: "",
      description: "",
      categoryId: "",
      image: null,
    },
  });

  const addProductMutation = useAddProduct(); // 제품 추가를 위한 mutation

  const onSubmit = async (data) => {
    try {
      if (!data.image[0]) {
        throw new Error("이미지를 선택해야 합니다.");
      }

      if (!data.categoryId) {
        throw new Error("카테고리를 선택해야 합니다.");
      }

      const imageUrl = await uploadImage(data.image[0]);
      if (!imageUrl) {
        throw new Error("이미지 업로드에 실패했습니다.");
      }

      const newProduct = createNewProduct(data, imageUrl);
      await addProductMutation.mutateAsync(newProduct);
      onClose();
      onProductAdded();
      addToast("물품 등록에 성공했습니다!", success);
      reset(); // 폼 초기화
    } catch (error) {
      console.error("물품 등록에 실패했습니다.", error);
    }
  };

  const handleCategoryChange = (value) => {
    setValue("categoryId", value); // React Hook Form의 setValue로 카테고리 선택값 설정
  };

  // 이미지 파일 변경 확인
  const watchImage = watch("image");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>상품 등록</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {/* 상품명 */}
            <Input
              {...register("title", { required: "상품명을 입력해주세요" })}
              placeholder="상품명"
            />

            {/* 가격 */}
            <Input
              type="number"
              {...register("price", {
                required: "가격을 입력해주세요",
                min: { value: 1, message: "가격은 1 이상이어야 합니다." },
              })}
              placeholder="가격"
            />

            {/* 상품 설명 */}
            <Textarea
              {...register("description", {
                required: "상품 설명을 입력해주세요.",
              })}
              className="resize-none"
              placeholder="상품 설명"
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}

            {/* 카테고리 */}
            <Select
              onValueChange={handleCategoryChange}
              value={watch("categoryId")}
            >
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((category) => category.id !== ALL_CATEGORY_ID)
                  .map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {/* 이미지 업로드 */}
            <Input
              className="cursor-pointer"
              type="file"
              accept="image/*"
              {...register("image", { required: "이미지를 선택해주세요" })}
            />
            {errors.image && (
              <p className="text-red-500">{errors.image.message}</p>
            )}
            {watchImage && watchImage[0] && (
              <p>이미지 파일 : {watchImage[0].name}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={addProductMutation.isLoading}>
              {addProductMutation.isLoading ? "등록 중..." : "등록"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
