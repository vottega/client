"use client";

import { Role } from "@/lib/api/types/auth-service.dto";
import { UUID } from "crypto";
import { createContext, useContext, ReactNode, useState } from "react";

interface AuthState {
  role?: Role;
  userId?: number;
  participantId?: UUID;
}

interface AuthContextValue {
  role?: Role;
  userId?: number;
  participantId?: UUID;
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

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({});

  const setAuth = (newState: AuthState) => {
    setAuthState(newState);
  };

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
}
