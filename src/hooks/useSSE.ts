import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { subscribeToSSE } from "@/lib/api/sse";
import { apiClient } from "@/lib/api/client";

export const useSSE = <T extends unknown>(
  key: string,
  sseUrl: string | null,
  token: string | null,
) => {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<T>({
    queryKey: ["sse", key],
    queryFn: async () => {
      if (!sseUrl) throw new Error("SSE URL is required");
      const response = await apiClient.get(sseUrl);
      return response.data;
    },
    enabled: !!sseUrl,
    staleTime: 0, // SSE 데이터는 항상 fresh하게 처리
    refetchInterval: false, // SSE는 polling이 아니므로 비활성화
  });

  useEffect(() => {
    if (!sseUrl || !token) return;

    const unsubscribe = subscribeToSSE(
      sseUrl,
      (incomingData) => {
        // queryClient로 React Query 캐시 업데이트
        queryClient.setQueryData<T>(["sse", key], (prev) => {
          if (!prev) return incomingData;
          // 병합 방식은 데이터 구조에 따라 커스터마이징
          return {
            ...prev,
            ...incomingData,
          };
        });
      },
      token,
    );

    return unsubscribe;
  }, [sseUrl, queryClient, key, token]);

  return { data, error, isLoading };
};
