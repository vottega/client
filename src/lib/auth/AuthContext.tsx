import { isHttpError } from "@/lib/api/errors";
import { useLogout, useVerifyToken } from "@/lib/api/queries/auth";
import { type AuthResponseDTO, type VerifyResponseDTO } from "@/lib/api/types/auth-service.dto";
import { getToken } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, memo, ReactNode, useContext, useEffect } from "react";

interface AuthContextValue extends VerifyResponseDTO, AuthResponseDTO {}

const NOT_MOUNTED = Symbol("AuthProvider not mounted");

export const NOT_AUTHENTICATED = Symbol("User not authenticated");

const AuthContext = createContext<AuthContextValue | typeof NOT_MOUNTED | typeof NOT_AUTHENTICATED>(
  NOT_MOUNTED,
);

export function useAuth(): AuthContextValue | typeof NOT_AUTHENTICATED {
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
  const queryClient = useQueryClient();
  const { data: verifyData, error: verifyError } = useVerifyToken(token ?? "");
  const { mutate: logout } = useLogout();

  useEffect(() => {
    if (verifyError && isHttpError(verifyError) && verifyError.isUnauthorized()) {
      logout();
      return;
    }
  }, [verifyError, queryClient]);

  if (
    token === null ||
    verifyData === undefined ||
    (verifyError && isHttpError(verifyError) && verifyError.isUnauthorized())
  ) {
    return <AuthContext.Provider value={NOT_AUTHENTICATED}>{children}</AuthContext.Provider>;
  }

  return <AuthContext.Provider value={{ ...verifyData, token }}>{children}</AuthContext.Provider>;
});
