import { queryKeys } from "@/lib/api/queries";
import { useVerifyToken } from "@/lib/api/queries/auth";
import { type VerifyResponseDTO } from "@/lib/api/types/auth-service.dto";
import { getToken } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, memo, ReactNode, useCallback, useContext } from "react";

interface AuthContextValue extends VerifyResponseDTO {
  setAuth: (state: VerifyResponseDTO) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = memo(function AuthProvider({ children }: AuthProviderProps) {
  const token = getToken();

  if (token === null) {
    return <></>;
  }

  const queryClient = useQueryClient();
  const { data: verifyData, isLoading: _isLoading, error: _error } = useVerifyToken(token);
  const setAuth = useCallback(
    (newState: VerifyResponseDTO) => {
      queryClient.setQueryData(queryKeys.auth.verify(), newState);
    },
    [queryClient],
  );

  if (verifyData === undefined) {
    return <></>;
  }

  return <AuthContext.Provider value={{ ...verifyData, setAuth }}>{children}</AuthContext.Provider>;
});
