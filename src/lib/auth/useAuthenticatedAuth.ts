import { type AuthResponseDTO, type VerifyResponseDTO } from "@/lib/api/types/auth-service.dto";
import { createContext, useContext } from "react";

interface AuthContextValue extends VerifyResponseDTO, AuthResponseDTO {}

// AuthGuard 내부에서만 사용할 수 있는 타입 안전한 컨텍스트
export const AuthenticatedAuthContext = createContext<AuthContextValue | null>(null);

export function useAuthenticatedAuth(): AuthContextValue {
  const context = useContext(AuthenticatedAuthContext);
  if (!context) {
    throw new Error("useAuthenticatedAuth must be used within AuthGuard");
  }
  return context;
}

// 역할별 타입 안전한 접근 함수들
export function useUserAuth() {
  const auth = useAuthenticatedAuth();

  if (auth.role !== "USER") {
    throw new Error("useUserAuth must be used when role is USER");
  }

  if (!auth.id || !auth.userId) {
    throw new Error("User authentication data is incomplete");
  }

  return {
    ...auth,
    id: auth.id,
    userId: auth.userId,
  };
}

export function useParticipantAuth() {
  const auth = useAuthenticatedAuth();

  if (auth.role !== "PARTICIPANT") {
    throw new Error("useParticipantAuth must be used when role is PARTICIPANT");
  }

  if (!auth.participantId || !auth.roomId) {
    throw new Error("Participant authentication data is incomplete");
  }

  return {
    ...auth,
    participantId: auth.participantId,
    roomId: auth.roomId,
  };
}

// 역할에 따른 타입 안전한 접근
export function useAuthByRole() {
  const auth = useAuthenticatedAuth();

  if (auth.role === "USER") {
    if (!auth.id || !auth.userId) {
      throw new Error("User authentication data is incomplete");
    }
    return {
      role: "USER" as const,
      id: auth.id,
      userId: auth.userId,
      token: auth.token,
    };
  }

  if (auth.role === "PARTICIPANT") {
    if (!auth.participantId || !auth.roomId) {
      throw new Error("Participant authentication data is incomplete");
    }
    return {
      role: "PARTICIPANT" as const,
      participantId: auth.participantId,
      roomId: auth.roomId,
      token: auth.token,
    };
  }

  throw new Error("Invalid role");
}
