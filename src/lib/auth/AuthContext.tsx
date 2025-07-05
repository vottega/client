import { Endpoints } from "@/lib/api/endpoints";
import { customFetch } from "@/lib/api/fetcher";
import {
  Role,
  // type VerifyRequestDTO,
  type VerifyResponseDTO,
} from "@/lib/api/types/auth-service.dto";
import { getToken } from "@/lib/auth";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useMemo,
  useEffect,
  memo,
} from "react";
import useSWR from "swr";

type UUID = string;

interface AuthState {
  role?: Role;
  id?: number | null;
  userId?: string | null;
  participantId?: UUID | null;
}

interface AuthContextValue {
  role?: Role;
  id?: number | null;
  userId?: string | null;
  participantId?: UUID | null;
  setAuth: (state: AuthState) => void;
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
  console.log("AuthProvider");
  const token = useMemo(() => getToken(), []);

  const verifyTokenFetcher = useCallback(
    async (url: string) =>
      customFetch<VerifyResponseDTO>(url, {
        method: "POST",
        body: JSON.stringify({ token }),
      }),
    [token],
  );

  const {
    data: verifyData,
    isLoading: _isLoading,
    error: _error,
  } = useSWR(token ? Endpoints.auth.verify().toFullPath() : null, verifyTokenFetcher);

  const [authState, setAuthState] = useState<AuthState>({});

  useEffect(() => {
    if (verifyData) {
      setAuthState({
        role: verifyData.role,
        userId: verifyData.userId,
        participantId: verifyData.participantId,
        id: verifyData.id,
      });
    }
  }, [verifyData]);

  const setAuth = useCallback((newState: AuthState) => {
    setAuthState(newState);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
});
