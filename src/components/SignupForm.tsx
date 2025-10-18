import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  useCheckEmail,
  useCheckUserId,
  useCreateUser,
  useSendEmail,
  useValidateCode,
} from "@/lib/api/queries/user";

import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

// 각 단계별 스키마
const stepSchemas = {
  name: z.object({ name: z.string().min(1, "이름을 입력해주세요.") }),
  userId: z.object({ userId: z.string().min(4, "아이디는 4자 이상이어야 합니다.") }),
  password: z.object({ password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다.") }),
  email: z.object({ email: z.string().email("유효한 이메일을 입력해주세요.") }),
  emailAuthCode: z.object({ emailAuthCode: z.string().min(4, "인증코드를 입력해주세요.") }),
};

type StepName = keyof typeof stepSchemas;
type FormData = {
  name: string;
  userId: string;
  password: string;
  email: string;
  emailAuthCode: string;
};

const STEP_ORDER: StepName[] = ["name", "userId", "password", "email", "emailAuthCode"];

export function SignupForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<StepName>("name");
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [userIdCheckResult, setUserIdCheckResult] = useState<"idle" | "valid" | "duplicated">(
    "idle",
  );
  const [emailCheckResult, setEmailCheckResult] = useState<"idle" | "valid" | "duplicated">("idle");
  const [emailCodeVerified, setEmailCodeVerified] = useState<"idle" | "success" | "failed">("idle");
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm({
    resolver: zodResolver(stepSchemas[currentStep]),
    defaultValues: { [currentStep]: formData[currentStep] || "" },
  });

  const { mutate: sendEmail, error: sendEmailError } = useSendEmail();
  const { mutate: register, error: registerError, isSuccess: registerSuccess } = useCreateUser();
  const { mutateAsync: checkUserId } = useCheckUserId();
  const { mutateAsync: checkEmail } = useCheckEmail();
  const { mutateAsync: verifyEmailCode } = useValidateCode();

  // 다음 단계로 이동
  const goToNextStep = () => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      setCurrentStep(STEP_ORDER[currentIndex + 1]);
    }
  };

  // 이전 단계로 이동
  const goToPreviousStep = () => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEP_ORDER[currentIndex - 1]);
    }
  };

  // 현재 단계 완료된 항목들
  const completedSteps = STEP_ORDER.slice(0, STEP_ORDER.indexOf(currentStep));

  const onSubmit = async (values: Record<string, string>) => {
    const value = values[currentStep];

    // 현재 단계 데이터 저장
    setFormData((prev) => ({ ...prev, [currentStep]: value }));

    // 각 단계별 특별 처리
    if (currentStep === "userId") {
      if (userIdCheckResult !== "valid") {
        form.setError(currentStep, { message: "아이디 중복확인을 해주세요." });
        return;
      }
    } else if (currentStep === "email") {
      if (emailCheckResult !== "valid") {
        form.setError(currentStep, { message: "이메일 중복확인을 해주세요." });
        return;
      }
      // 이메일 인증코드 전송
      if (!emailSent) {
        sendEmail({ email: value });
        setEmailSent(true);
      }
    } else if (currentStep === "emailAuthCode") {
      if (emailCodeVerified !== "success") {
        form.setError(currentStep, { message: "이메일 인증을 완료해주세요." });
        return;
      }
      // 최종 회원가입 요청
      register({
        ...formData,
        [currentStep]: value,
      } as FormData);
      return;
    }

    goToNextStep();
  };

  const handleCheckUserId = async () => {
    const userId = form.getValues("userId");
    if (!userId) {
      form.setError("userId", { message: "아이디를 입력해주세요." });
      return;
    }
    try {
      const result = await checkUserId({ userId });
      setUserIdCheckResult(result.isDuplicate ? "duplicated" : "valid");
    } catch {
      setUserIdCheckResult("duplicated");
    }
  };

  const handleCheckEmail = async () => {
    const email = form.getValues("email");
    if (!email) {
      form.setError("email", { message: "이메일을 입력해주세요." });
      return;
    }
    try {
      const result = await checkEmail({ email });
      setEmailCheckResult(result.isDuplicate ? "duplicated" : "valid");
    } catch {
      setEmailCheckResult("duplicated");
    }
  };

  const handleVerifyEmailCode = async () => {
    const emailAuthCode = form.getValues("emailAuthCode");
    if (!emailAuthCode || !formData.email) {
      form.setError("emailAuthCode", { message: "인증코드를 입력해주세요." });
      return;
    }
    try {
      await verifyEmailCode({ email: formData.email, emailAuthCode });
      setEmailCodeVerified("success");
    } catch {
      setEmailCodeVerified("failed");
    }
  };

  // 단계 변경 시 폼 리셋
  useEffect(() => {
    form.reset({ [currentStep]: formData[currentStep] || "" });
  }, [currentStep, form, formData]);

  useEffect(() => {
    if (registerSuccess) {
      toast({
        title: "회원가입 완료",
        description: "로그인 페이지로 이동합니다.",
        duration: 1500,
      });

      // 2초 후 자동으로 로그인 페이지로 이동
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    }
  }, [registerSuccess, navigate, toast]);

  useEffect(() => {
    if (sendEmailError) {
      toast({
        title: "이메일 전송 실패",
        description: "이메일 전송에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  }, [sendEmailError, toast]);

  useEffect(() => {
    if (registerError) {
      // 기본 에러 메시지 표시
      const errorMessage = registerError.message || "회원가입에 실패했습니다. 다시 시도해주세요.";

      toast({
        title: "회원가입 실패",
        description: errorMessage,
        variant: "destructive",
        action: (
          <ToastAction
            altText="다시 시도"
            onClick={() => {
              // 이메일 인증 단계로 돌아가기
              setCurrentStep("emailAuthCode");
              setEmailCodeVerified("idle");
            }}
          >
            다시 시도
          </ToastAction>
        ),
      });
    }
  }, [registerError, toast]);

  const getStepQuestion = (step: StepName) => {
    const questions = {
      name: "반가워요! 이름을 알려주세요.",
      userId: "사용하실 아이디를 입력해주세요.",
      password: "비밀번호를 설정해주세요.",
      email: "이메일을 입력해주세요.",
      emailAuthCode: "인증코드를 입력해주세요.",
    };
    return questions[step];
  };

  const getStepPlaceholder = (step: StepName) => {
    const placeholders = {
      name: "홍길동",
      userId: "영문, 숫자 포함 4자 이상",
      password: "6자 이상 입력",
      email: "example@email.com",
      emailAuthCode: "6자리 인증코드",
    };
    return placeholders[step];
  };

  return (
    <div className="container max-w-md mx-auto py-8">
      {/* 진행도 표시 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            {STEP_ORDER.indexOf(currentStep) + 1} / {STEP_ORDER.length}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((STEP_ORDER.indexOf(currentStep) + 1) / STEP_ORDER.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* 완료된 단계들 요약 */}
      {completedSteps.length > 0 && (
        <div className="mb-6 space-y-2">
          {completedSteps.map((step) => (
            <Card key={step} className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {step === "name" && "이름"}
                  {step === "userId" && "아이디"}
                  {step === "password" && "비밀번호"}
                  {step === "email" && "이메일"}
                  {step === "emailAuthCode" && "인증코드"}
                </span>
                <span className="text-sm font-medium">
                  {step === "password" ? "••••••" : formData[step]}
                </span>
                <Button variant="ghost" size="sm" onClick={() => setCurrentStep(step)}>
                  수정
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 현재 질문 */}
      <Card>
        <CardHeader>
          <CardTitle>{getStepQuestion(currentStep)}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name={currentStep}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type={
                          currentStep === "password"
                            ? "password"
                            : currentStep === "email"
                              ? "email"
                              : "text"
                        }
                        placeholder={getStepPlaceholder(currentStep)}
                        disabled={
                          currentStep === "emailAuthCode" && emailCodeVerified === "success"
                        }
                        onChange={(e) => {
                          field.onChange(e);
                          // 아이디 변경 시 중복확인 상태 초기화
                          if (currentStep === "userId") {
                            setUserIdCheckResult("idle");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 각 단계별 추가 버튼들 */}
              {currentStep === "userId" && (
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCheckUserId}
                    className="w-full"
                  >
                    중복확인
                  </Button>
                  {userIdCheckResult === "valid" && (
                    <p className="text-sm text-green-600">사용 가능한 아이디입니다.</p>
                  )}
                  {userIdCheckResult === "duplicated" && (
                    <p className="text-sm text-destructive">이미 사용 중인 아이디입니다.</p>
                  )}
                </div>
              )}

              {currentStep === "email" && (
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCheckEmail}
                    className="w-full"
                    disabled={emailCheckResult === "valid"}
                  >
                    {emailCheckResult === "valid" ? "확인 완료" : "중복확인"}
                  </Button>
                  {emailCheckResult === "valid" && (
                    <p className="text-sm text-green-600">사용 가능한 이메일입니다.</p>
                  )}
                  {emailCheckResult === "duplicated" && (
                    <p className="text-sm text-destructive">이미 사용 중인 이메일입니다.</p>
                  )}
                </div>
              )}

              {currentStep === "emailAuthCode" && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {formData.email}로 인증코드를 전송했습니다.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleVerifyEmailCode}
                    className="w-full"
                    disabled={emailCodeVerified === "success"}
                  >
                    {emailCodeVerified === "success" ? "인증 완료" : "코드 확인"}
                  </Button>
                  {emailCodeVerified === "success" && (
                    <p className="text-sm text-green-600">이메일 인증이 완료되었습니다.</p>
                  )}
                  {emailCodeVerified === "failed" && (
                    <p className="text-sm text-destructive">인증코드가 일치하지 않습니다.</p>
                  )}
                </div>
              )}

              {/* 네비게이션 버튼 */}
              <div className="flex gap-3">
                {STEP_ORDER.indexOf(currentStep) > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPreviousStep}
                    className="flex-1"
                  >
                    이전
                  </Button>
                )}
                <Button type="submit" className="flex-1" disabled={registerSuccess}>
                  {currentStep === "emailAuthCode" ? "회원가입 완료" : "다음"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
