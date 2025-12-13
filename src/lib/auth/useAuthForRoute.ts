import { useAuth, VERIFYING, NOT_AUTHENTICATED } from "./authUtils";
import type { AuthState } from "./types";

/**
 * 라우팅용 권한 확인 훅
 * ProtectedRoute에서 사용하기 위한 간단한 AuthState 반환
 */
export function useAuthForRoute(): AuthState {
  const auth = useAuth();

  if (auth === VERIFYING) {
    return { status: "loading" };
  }

  if (auth === NOT_AUTHENTICATED) {
    return { status: "loading" }; // AuthGuard에서 처리하므로 여기서는 loading으로 처리
  }

  return {
    status: "authed",
    role: auth.role,
    userId: auth.userId,
    participantId: auth.participantId,
    roomId: auth.roomId,
  };
}

