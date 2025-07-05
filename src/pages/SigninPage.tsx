import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { customFetch } from "@/lib/api/fetcher";
import { Endpoints } from "@/lib/api/endpoints";
import type { AuthResponseDTO } from "@/lib/api/types/auth-service.dto";
import { useAuth } from "@/lib/auth/AuthContext";

interface SigninFormData {
  userId: string;
  password: string;
}

export default function SigninPage() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<SigninFormData>({
    defaultValues: {
      userId: "",
      password: "",
    },
  });

  const signinFetcher = useCallback(
    async (url: string, { arg }: { arg: SigninFormData }) =>
      customFetch<AuthResponseDTO>(url, {
        method: "POST",
        body: JSON.stringify(arg),
      }),
    [],
  );

  const {
    trigger: signin,
    data: signinData,
    error: signinError,
  } = useSWRMutation(Endpoints.auth.authenticateUser().toFullPath(), signinFetcher);

  const onSubmit = (values: SigninFormData) => {
    signin(values);
  };

  useEffect(() => {
    if (signinData) {
      localStorage.setItem("token", signinData.token);
      setAuth({
        role: "USER",
        userId: getValues("userId"),
        id: 1,
      });
      navigate("/");
    }
  }, [signinData, setAuth, navigate, getValues]);

  useEffect(() => {
    if (signinError) {
      console.log(signinError);
    }
  }, [signinError]);

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <p>vottega</p>
            <h1 className="text-3xl font-bold">로그인</h1>
            <p className="text-balance text-muted-foreground">
              로그인을 위해 아이디와 비밀번호를 입력해주세요.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="userId">아이디</Label>
              <Input
                id="userId"
                type="text"
                {...register("userId", {
                  required: "아이디를 입력해주세요",
                  minLength: {
                    value: 4,
                    message: "아이디는 4자 이상이어야 합니다",
                  },
                })}
              />
              {errors.userId && <p className="text-sm text-red-500">{errors.userId.message}</p>}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">비밀번호</Label>
                <Link to="/forgot-password" className="ml-auto inline-block text-sm underline">
                  비밀번호 찾기
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "비밀번호를 입력해주세요",
                })}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "로그인 중..." : "로그인"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link to="/signin/register" className="underline">
              회원가입
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
