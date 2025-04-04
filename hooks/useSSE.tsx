import useSWR from "swr";
import { useCallback, useEffect } from "react";
import { subscribeToSSE } from "@/lib/api/sse";
import { customFetch } from "@/lib/api/fetcher";

export const useSSE = <T extends unknown>(key: string, sseUrl: string) => {
  const fetcher = useCallback((url: string) => customFetch<T>(url), []);

  const { data, mutate, error, isLoading } = useSWR<T>(key, fetcher);

  useEffect(() => {
    if (!sseUrl) return;

    const unsubscribe = subscribeToSSE(sseUrl, (incomingData) => {
      // mutate로 SWR 캐시 업데이트
      mutate((prev) => {
        if (!prev) return incomingData;
        // 병합 방식은 데이터 구조에 따라 커스터마이징
        return {
          ...prev,
          ...incomingData,
        };
      }, false); // false = revalidation 없이 캐시만 수정
    });

    return unsubscribe;
  }, [sseUrl, mutate]);

  return { data, error, isLoading };
};
