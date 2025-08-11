import { useToast } from "@/components/ui/use-toast";
import { isHttpError } from "@/lib/api/errors";
import { useCallback } from "react";

interface ErrorMessages {
  forbidden?: {
    title?: string;
    description?: string;
  };
  unauthorized?: {
    title?: string;
    description?: string;
  };
  notFound?: {
    title?: string;
    description?: string;
  };
  serverError?: {
    title?: string;
    description?: string;
  };
  unknown?: {
    title?: string;
    description?: string;
  };
}

const DEFAULT_MESSAGES: Required<ErrorMessages> = {
  forbidden: {
    title: "접근 권한이 없습니다.",
    description: "관리자에게 문의해주세요.",
  },
  unauthorized: {
    title: "로그인이 필요합니다.",
    description: "로그인 후 다시 시도해주세요.",
  },
  notFound: {
    title: "요청한 리소스를 찾을 수 없습니다.",
    description: "관리자에게 문의해주세요.",
  },
  serverError: {
    title: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    description: "관리자에게 문의해주세요.",
  },
  unknown: {
    title: "알 수 없는 오류가 발생했습니다.",
    description: "관리자에게 문의해주세요.",
  },
};

export function useHttpErrorHandler(customMessages?: ErrorMessages) {
  const { toast } = useToast();

  const handleError = useCallback(
    (error: unknown) => {
      if (!error) return;

      const messages = {
        ...DEFAULT_MESSAGES,
        ...customMessages,
      };

      if (isHttpError(error)) {
        if (error.isForbidden()) {
          toast({
            variant: "destructive",
            title: messages.forbidden.title,
            description: messages.forbidden.description,
          });
        } else if (error.isUnauthorized()) {
          toast({
            variant: "destructive",
            title: messages.unauthorized.title,
            description: messages.unauthorized.description,
          });
        } else if (error.isNotFound()) {
          toast({
            variant: "destructive",
            title: messages.notFound.title,
            description: messages.notFound.description,
          });
        } else if (error.isServerError()) {
          toast({
            variant: "destructive",
            title: messages.serverError.title,
            description: messages.serverError.description,
          });
        } else {
          toast({
            variant: "destructive",
            title: "오류가 발생했습니다",
            description: error.message,
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: messages.unknown.title,
          description: messages.unknown.description,
        });
      }
    },
    [customMessages, toast],
  );

  return handleError;
}
