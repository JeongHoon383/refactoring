import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, User } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { pageRoutes } from "@/apiRoutes";
import { EMAIL_PATTERN } from "@/constants";
import { Layout, authStatusType } from "@/pages/common/components/Layout";
import useAuthStore from "@/store/auth/authSlice";
import useToastStore from "@/store/toast/toast";

export const RegisterPage = () => {
  const addToast = useToastStore((state) => state.addToast);
  const navigate = useNavigate();
  const { registerUser, registerStatus, registerError } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};
    if (!name) formErrors.name = "이름을 입력하세요";
    if (!email) {
      formErrors.email = "이메일을 입력하세요";
    } else if (!EMAIL_PATTERN.test(email)) {
      formErrors.email = "이메일 양식이 올바르지 않습니다";
    }
    if (!password) formErrors.password = "비밀번호를 입력하세요";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await registerUser(email, password, name);
        addToast("회원가입에 성공 했습니다!", "success");
        navigate(pageRoutes.login);
      } catch (error) {
        console.error(
          "회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.",
          error
        );
      }
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
    }
  };

  return (
    <Layout authStatus={authStatusType.NEED_NOT_LOGIN}>
      <div className="w-full h-screen max-w-md mx-auto space-y-8 flex flex-col justify-center">
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="name"
                type="text"
                className="pl-10"
                value={name}
                onChange={handleInputChange}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="email"
                type="email"
                className="pl-10"
                value={email}
                onChange={handleInputChange}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="password"
                type="password"
                className="pl-10"
                value={password}
                onChange={handleInputChange}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={registerStatus === "loading"}
          >
            {registerStatus === "loading" ? "가입 중..." : "회원가입"}
          </Button>
          {registerError && (
            <p className="text-sm text-red-500">{registerError}</p>
          )}
        </form>
      </div>
    </Layout>
  );
};
