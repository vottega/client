import { isHttpError } from "@/lib/api/errors";
import { useLogout, useVerifyToken } from "@/lib/api/queries/auth";
import { type AuthResponseDTO, type VerifyResponseDTO } from "@/lib/api/types/auth-service.dto";
import { getToken } from "@/lib/auth";
import { createContext, memo, ReactNode, useContext, useEffect } from "react";

interface AuthContextValue extends VerifyResponseDTO, AuthResponseDTO {}

const NOT_MOUNTED = Symbol("AuthProvider not mounted");
export const NOT_AUTHENTICATED = Symbol("User not authenticated");
export const VERIFYING = Symbol("Token verification in progress");

const AuthContext = createContext<
  AuthContextValue | typeof NOT_MOUNTED | typeof NOT_AUTHENTICATED | typeof VERIFYING
>(NOT_MOUNTED);

export function useAuth(): AuthContextValue | typeof NOT_AUTHENTICATED | typeof VERIFYING {
  const context = useContext(AuthContext);
  if (context === NOT_MOUNTED) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = memo(function AuthProvider({ children }: AuthProviderProps) {
  const token = getToken();
  const {
    data: verifyData,
    error: verifyError,
    isLoading: isVerifying,
  } = useVerifyToken(token ?? "");
  const { mutate: logout } = useLogout();

  useEffect(() => {
    if (verifyError && isHttpError(verifyError) && verifyError.isUnauthorized()) {
      logout();
      return;
    }
  }, [verifyError, logout]);

  // 토큰이 없으면 인증되지 않은 상태
  if (token === null) {
    return <AuthContext.Provider value={NOT_AUTHENTICATED}>{children}</AuthContext.Provider>;
  }

  // 토큰 검증 중인 경우
  if (isVerifying || verifyData === undefined) {
    return <AuthContext.Provider value={VERIFYING}>{children}</AuthContext.Provider>;
  }

  // 토큰 검증 실패한 경우
  if (verifyError && isHttpError(verifyError) && verifyError.isUnauthorized()) {
    return <AuthContext.Provider value={NOT_AUTHENTICATED}>{children}</AuthContext.Provider>;
  }

  // 토큰 검증 성공한 경우
  return <AuthContext.Provider value={{ ...verifyData, token }}>{children}</AuthContext.Provider>;
});
