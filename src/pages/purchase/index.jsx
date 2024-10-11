import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { makePurchase } from "@/api/purchase";
import { pageRoutes } from "@/apiRoutes";

import { PHONE_PATTERN } from "@/constants";
import { Layout, authStatusType } from "@/pages/common/components/Layout";
import { ItemList } from "@/pages/purchase/components/ItemList";
import { Payment } from "@/pages/purchase/components/Payment";
import { ShippingInformationForm } from "@/pages/purchase/components/ShippingInformationForm";
import useAuthStore from "../../store/auth/authSlice"; // Zustand로 변경
import useCartStore from "@/store/cart/cartSlice"; // Zustand로 카트 관리
import useToastStore from "@/store/toast/toast";

export const Purchase = () => {
  const addToast = useToastStore((state) => state.addToast);
  const navigate = useNavigate();
  const { user } = useAuthStore(); // Zustand에서 user 상태 가져오기
  const { cart, resetCart } = useCartStore(); // Zustand에서 cart 상태 가져오기 및 리셋 함수
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [formData, setFormData] = useState({
    name: user?.displayName ?? "",
    address: "",
    phone: "",
    requests: "",
    payment: "accountTransfer",
  });
  const [errors, setErrors] = useState({ phone: "" });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { address, phone } = formData;
    const isPhoneValid = PHONE_PATTERN.test(phone);
    setIsFormValid(address.trim() !== "" && isPhoneValid);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "phone") {
      if (!PHONE_PATTERN.test(value) && value !== "") {
        setErrors((prev) => ({
          ...prev,
          phone: "-를 포함한 휴대폰 번호만 가능합니다",
        }));
      } else {
        setErrors((prev) => ({ ...prev, phone: "" }));
      }
    }
  };

  // 구매 처리 비동기 로직
  const handleClickPurchase = async (e) => {
    e.preventDefault();
    if (!isFormValid || !user) return;

    setIsLoading(true);
    const purchaseData = {
      ...formData,
      totalAmount: 0,
      paymentMethod: formData.payment,
      shippingAddress: formData.address,
    };

    try {
      await makePurchase(purchaseData, user.uid, cart);
      resetCart(user.uid); // 카트 리셋
      console.log("구매 성공!");
      navigate(pageRoutes.main);
      addToast("구매 성공했습니다!", "success");
    } catch (err) {
      console.error("구매 처리 중 오류 발생:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout
      containerClassName="pt-[30px]"
      authStatus={authStatusType.NEED_LOGIN}
    >
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <form onSubmit={handleClickPurchase}>
            <ShippingInformationForm
              formData={formData}
              onChange={handleInputChange}
              errors={errors}
            />
            <ItemList />
            <Payment
              paymentMethod={formData.payment}
              onPaymentMethodChange={handleInputChange}
            />
            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    처리 중...
                  </>
                ) : (
                  "구매하기"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};
