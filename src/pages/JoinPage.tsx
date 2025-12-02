import { ErrorState } from "@/components/ErrorState";
import { Loader } from "@/components/Loader";
import { useAuthenticateParticipant, useVerifyToken } from "@/lib/api/queries/auth";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getToken } from "../lib/auth";

export default function JoinPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const token = getToken();

  const {
    mutate: authenticate,
    error: authError,
    data: authData,
    isPending: isAuthenticating,
    isSuccess: isAuthenticated,
  } = useAuthenticateParticipant();

  const { isSuccess: isVerifySuccess, refetch: verifyToken } = useVerifyToken(token ?? "");

  // 전체 로딩 상태 계산
  const isLoading = useMemo(() => {
    return isAuthenticating;
  }, [isAuthenticating]);

  // 에러 상태 계산
  const error = useMemo(() => {
    return authError;
  }, [authError]);

  // 재시도 핸들러
  const handleRetry = () => {
    if (uuid) {
      authenticate({ participantId: uuid });
    }
  };

  // 초기 인증 요청
  useEffect(() => {
    if (uuid) {
      authenticate({ participantId: uuid });
    }
  }, [uuid, authenticate]);

  useEffect(() => {
    if (isAuthenticated) {
      verifyToken();
    }
  }, [isAuthenticated, verifyToken]);

  useEffect(() => {
    if (isVerifySuccess && authData?.roomId) {
      navigate(`/rooms/${authData.roomId}`);
    }
  }, [isVerifySuccess, navigate, authData?.roomId]);

  // UUID가 없는 경우
  if (!uuid) {
    return (
      <div className="flex h-screen items-center justify-center">
        <ErrorState error={new Error("잘못된 접근입니다.")} onRetry={undefined} />
      </div>
    );
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <Loader message="회의실 입장 중..." size={32} />
          <p className="text-sm text-muted-foreground">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <ErrorState error={error} onRetry={handleRetry} />
      </div>
    );
  }

  // 인증 성공했지만 아직 검증 중인 경우 (실제로는 위의 isLoading에서 처리됨)
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <Loader message="회의실 입장 중..." size={32} />
        <p className="text-sm text-muted-foreground">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}
