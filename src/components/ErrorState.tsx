import { Button } from "@/components/ui/button";
import { isHttpError } from "@/lib/api/errors";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  const navigate = useNavigate();
  const handleNavigateHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  let errorMessage = "데이터를 불러오는데 실패했습니다.";
  let errorTitle = "로딩 실패";

  if (isHttpError(error)) {
    switch (error.statusCode) {
      case 401:
        errorTitle = "인증 실패";
        errorMessage = "로그인이 필요합니다. 다시 로그인해주세요.";
        break;
      case 403:
        errorTitle = "접근 거부";
        errorMessage = "해당 데이터에 접근할 권한이 없습니다.";
        break;
      case 404:
        errorTitle = "찾을 수 없음";
        errorMessage = "요청한 데이터를 찾을 수 없습니다.";
        break;
      case 500:
        errorTitle = "서버 오류";
        errorMessage = "서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        break;
      default:
        errorTitle = "네트워크 오류";
        errorMessage = "네트워크 연결을 확인하고 다시 시도해주세요.";
        break;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{errorTitle}</h3>
          <p className="text-sm text-muted-foreground max-w-md">{errorMessage}</p>
        </div>
        <div className="flex gap-2">
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              다시 시도
            </Button>
          )}
          <Button onClick={handleNavigateHome} variant="outline" size="sm">
            홈으로 이동
          </Button>
        </div>
      </div>
    </div>
  );
};
