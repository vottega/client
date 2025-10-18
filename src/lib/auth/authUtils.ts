import { createContext, useContext } from "react";
import { type AuthResponseDTO, type VerifyResponseDTO } from "@/lib/api/types/auth-service.dto";

export interface AuthContextValue extends VerifyResponseDTO, AuthResponseDTO {}

export const NOT_MOUNTED = Symbol("AuthProvider not mounted");
export const NOT_AUTHENTICATED = Symbol("User not authenticated");
export const VERIFYING = Symbol("Token verification in progress");

export const AuthContext = createContext<
  AuthContextValue | typeof NOT_MOUNTED | typeof NOT_AUTHENTICATED | typeof VERIFYING
>(NOT_MOUNTED);

export function useAuth(): AuthContextValue | typeof NOT_AUTHENTICATED | typeof VERIFYING {
  const context = useContext(AuthContext);
  if (context === NOT_MOUNTED) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
