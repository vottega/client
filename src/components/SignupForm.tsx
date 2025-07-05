import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  useCreateUser,
  useCheckUserId,
  useCheckEmail,
  useSendEmail,
  useValidateCode,
} from "@/lib/api/queries/user";

import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useNavigate } from "react-router-dom";

const signupSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  userId: z.string().min(4, "아이디는 4자 이상이어야 합니다."),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
  email: z.string().email("유효한 이메일을 입력해주세요."),
  emailAuthCode: z.string().min(4, "인증코드를 입력해주세요."),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [emailSent, setEmailSent] = useState(false);
  const [userIdCheckResult, setUserIdCheckResult] = useState<"idle" | "valid" | "duplicated">(
    "idle",
  );
  const [emailCheckResult, setEmailCheckResult] = useState<"idle" | "valid" | "duplicated">("idle");
  const [emailCodeVerified, setEmailCodeVerified] = useState<"idle" | "success" | "failed">("idle");

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      userId: "",
      password: "",
      email: "",
      emailAuthCode: "",
    },
  });

  const { mutate: sendEmail, data: _sendEmailData, error: sendEmailError } = useSendEmail();
  const { mutate: register, data: registerData } = useCreateUser();
  const { mutateAsync: checkUserId } = useCheckUserId();
  const { mutateAsync: checkEmail } = useCheckEmail();
  const { mutateAsync: verifyEmailCode } = useValidateCode();

  const onSubmit = (values: SignupFormValues) => {
    if (userIdCheckResult !== "valid") {
      form.setError("userId", { message: "아이디 중복확인을 해주세요." });
      return;
    }
    if (emailCodeVerified !== "success") {
      form.setError("emailAuthCode", { message: "이메일 인증을 완료해주세요." });
      return;
    }
    register(values);
  };

  const handleClickCheckEmail = async () => {
    const email = form.getValues("email");
    const emailAuthCode = form.getValues("emailAuthCode");
    if (!email || !emailAuthCode) {
      form.setError("emailAuthCode", { message: "입력값이 부족합니다." });
      return;
    }
    try {
      await verifyEmailCode({ email, emailAuthCode });
      setEmailCodeVerified("success");
    } catch {
      setEmailCodeVerified("failed");
    }
  };

  const handleClickCheckUserId = async () => {
    const value = form.getValues("userId");
    if (!value) {
      form.setError("userId", { message: "아이디를 입력해주세요." });
      return;
    }
    try {
      const result = await checkUserId({ userId: value });
      setUserIdCheckResult(result.available ? "valid" : "duplicated");
    } catch {
      setUserIdCheckResult("duplicated");
    }
  };

  const handleSendEmail = async () => {
    const email = form.getValues("email");
    if (!email) {
      form.setError("email", { message: "이메일을 먼저 입력해주세요." });
      return;
    }

    try {
      const result = await checkEmail({ email });
      if (!result.available) {
        setEmailCheckResult("duplicated");
        return;
      }
      setEmailCheckResult("valid");
    } catch {
      setEmailCheckResult("duplicated");
      return;
    }

    sendEmail({ email });
    setEmailSent(true);
  };

  useEffect(() => {
    if (registerData !== undefined) {
      toast({
        title: "회원가입 완료",
        description: "로그인 페이지로 이동해 로그인해주세요.",
        action: (
          <ToastAction altText="로그인하기" onClick={() => navigate("/signin")}>
            로그인하기
          </ToastAction>
        ),
      });
    }
  }, [registerData, navigate, toast]);

  useEffect(() => {
    if (sendEmailError) {
      toast({
        title: "이메일 전송 실패",
        description: "이메일 전송에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  }, [sendEmailError, toast]);

  return (
    <Card className="max-w-md mx-auto mt-10 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">회원가입</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    이름<span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>실명을 입력해주세요.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    아이디<span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
                  <div className="flex gap-2">
                    <FormControl className="flex-1">
                      <Input {...field} disabled={userIdCheckResult === "valid"} />
                    </FormControl>
                    <Button type="button" variant="outline" onClick={handleClickCheckUserId}>
                      중복확인
                    </Button>
                  </div>
                  <FormDescription>영문, 숫자 포함 4자 이상</FormDescription>
                  {userIdCheckResult === "valid" && (
                    <p className="text-sm text-green-600">사용 가능한 아이디입니다.</p>
                  )}
                  {userIdCheckResult === "duplicated" && (
                    <p className="text-sm text-destructive">이미 사용 중인 아이디입니다.</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    비밀번호<span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>6자 이상, 특수문자 포함 권장</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    이메일<span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
                  <div className="flex gap-2">
                    <FormControl className="flex-1">
                      <Input type="email" {...field} />
                    </FormControl>
                    <Button type="button" variant="outline" onClick={handleSendEmail}>
                      인증코드 전송
                    </Button>
                  </div>
                  <FormDescription>유효한 이메일 주소를 입력해주세요.</FormDescription>
                  {emailCheckResult === "valid" && (
                    <p className="text-sm text-green-600">사용 가능한 이메일입니다.</p>
                  )}
                  {emailCheckResult === "duplicated" && (
                    <p className="text-sm text-destructive">이미 사용 중인 이메일입니다.</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {emailSent && (
              <FormField
                control={form.control}
                name="emailAuthCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      인증코드<span className="text-red-500 ml-0.5">*</span>
                    </FormLabel>
                    <div className="flex gap-2">
                      <FormControl className="flex-1">
                        <Input {...field} disabled={emailCodeVerified === "success"} />
                      </FormControl>
                      <Button type="button" variant="outline" onClick={handleClickCheckEmail}>
                        코드 확인
                      </Button>
                    </div>
                    <FormDescription>메일로 수신한 인증코드를 입력해주세요.</FormDescription>
                    {emailCodeVerified === "success" && (
                      <p className="text-sm text-green-600">이메일 인증이 완료되었습니다.</p>
                    )}
                    {emailCodeVerified === "failed" && (
                      <p className="text-sm text-destructive">인증코드가 일치하지 않습니다.</p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" className="w-full">
              회원가입 완료
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
