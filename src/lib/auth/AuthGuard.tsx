import { NOT_AUTHENTICATED, VERIFYING, useAuth } from "@/lib/auth/authUtils";
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticatedAuthContext } from "./useAuthenticatedAuth";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 토큰 검증이 완료되고 인증되지 않은 경우에만 리다이렉트
    if (auth === NOT_AUTHENTICATED) {
      navigate("/signin");
    }
  }, [auth, navigate]);

  // 토큰 검증 중인 경우 로딩 상태 표시
  if (auth === VERIFYING || auth === NOT_AUTHENTICATED) {
    return null;
  }

  // AuthGuard 내부의 컴포넌트들은 항상 인증된 상태임을 보장
  return (
    <AuthenticatedAuthContext.Provider value={auth}>{children}</AuthenticatedAuthContext.Provider>
  );
}
