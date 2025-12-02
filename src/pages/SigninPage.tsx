import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { isHttpError } from "@/lib/api/errors";
import { useAuthenticateUser, useVerifyToken } from "@/lib/api/queries/auth";
import { getToken } from "@/lib/auth";

interface SigninFormData {
  userId: string;
  password: string;
}

export default function SigninPage() {
  const navigate = useNavigate();
  const token = getToken();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormData>({
    defaultValues: {
      userId: "",
      password: "",
    },
  });

  const {
    mutate: signin,
    error: signinError,
    isPending: isSigninPending,
    isSuccess: isSigninSuccess,
  } = useAuthenticateUser();

  const {
    error: verifyError,
    isSuccess: isVerifySuccess,
    refetch: verifyToken,
  } = useVerifyToken(token ?? "");

  const onSubmit = useCallback(
    (values: SigninFormData) => {
      signin(values);
    },
    [signin],
  );

  useEffect(() => {
    if (isSigninSuccess) {
      verifyToken();
    }
  }, [isSigninSuccess, verifyToken]);

  // 로그인 에러 처리
  useEffect(() => {
    if (signinError) {
      let errorMessage = "로그인에 실패했습니다. 다시 시도해주세요.";

      if (isHttpError(signinError)) {
        switch (signinError.statusCode) {
          case 400:
            errorMessage = "아이디 또는 비밀번호가 잘못되었습니다.";
            break;
          case 401:
            errorMessage = "인증에 실패했습니다. 아이디와 비밀번호를 확인해주세요.";
            break;
          case 403:
            errorMessage = "접근이 거부되었습니다. 관리자에게 문의하세요.";
            break;
          case 404:
            errorMessage = "존재하지 않는 사용자입니다.";
            break;
          case 429:
            errorMessage = "너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.";
            break;
          case 500:
          default:
            errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
            break;
        }
      }

      toast({
        variant: "destructive",
        title: "로그인 실패",
        description: errorMessage,
      });
    }
  }, [signinError, toast]);

  // 토큰 검증 에러 처리
  useEffect(() => {
    if (verifyError) {
      let errorMessage = "인증 확인에 실패했습니다.";

      if (isHttpError(verifyError)) {
        switch (verifyError.statusCode) {
          case 401:
            errorMessage = "토큰이 유효하지 않습니다. 다시 로그인해주세요.";
            break;
          case 403:
            errorMessage = "접근 권한이 없습니다.";
            break;
          default:
            errorMessage = "인증 확인 중 오류가 발생했습니다.";
            break;
        }
      }

      toast({
        variant: "destructive",
        title: "인증 실패",
        description: errorMessage,
      });
    }
  }, [verifyError, toast]);

  useEffect(() => {
    if (isVerifySuccess) {
      navigate("/");
    }
  }, [isVerifySuccess, navigate]);

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
            <Button type="submit" className="w-full" disabled={isSubmitting || isSigninPending}>
              {isSubmitting || isSigninPending ? "로그인 중..." : "로그인"}
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
