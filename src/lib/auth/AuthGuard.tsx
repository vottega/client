import { NOT_AUTHENTICATED, useAuth } from "@/lib/auth/AuthContext";
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 토큰이 없으면 로그인 페이지로 리다이렉트
    if (auth === NOT_AUTHENTICATED) {
      navigate("/signin");
    }
  }, [auth, navigate]);

  // 토큰이 없으면 렌더링하지 않음 (리다이렉트 중)
  if (auth === null) {
    return null;
  }

  return <>{children}</>;
}
