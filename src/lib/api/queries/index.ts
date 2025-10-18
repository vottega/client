import { isHttpError } from "@/lib/api/errors";
import { QueryClient, DefaultOptions } from "@tanstack/react-query";

const queryConfig: DefaultOptions = {
  queries: {
    retry: (failureCount, error: unknown) => {
      // 401, 403, 404, 409 에러는 재시도하지 않음
      if (isHttpError(error)) {
        if (
          error.isUnauthorized() ||
          error.isForbidden() ||
          error.isNotFound() ||
          error.isConflict()
        ) {
          console.log("재시도하지 않음", error.statusCode);
          return false;
        }
      }
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (구 cacheTime)
    refetchOnWindowFocus: false,
    refetchOnReconnect: "always",
  },
  mutations: {
    retry: false,
  },
};

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

// Query Keys 상수 정의
export const queryKeys = {
  auth: {
    verify: () => ["auth", "verify"] as const,
    user: () => ["auth", "user"] as const,
  },
  rooms: {
    all: () => ["rooms"] as const,
    byUser: () => ["rooms", "by-user"] as const,
    detail: (id: string | number) => ["rooms", "detail", id] as const,
  },
  votes: {
    all: () => ["votes"] as const,
    byRoom: (roomId: string | number) => ["votes", "by-room", roomId] as const,
    detail: (id: string | number) => ["votes", "detail", id] as const,
  },
  users: {
    all: () => ["users"] as const,
    detail: (id: string | number) => ["users", "detail", id] as const,
  },
} as const;
