import { useEffect, useState, useCallback } from "react";
import { Endpoints } from "@/lib/api/endpoints";
import { subscribeToSSE } from "@/lib/api/sse";
import { getToken } from "@/lib/auth";
import { useVerifyToken } from "@/lib/api/queries/auth";

export const useSSE = <T extends unknown>(roomId: string) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const token = getToken();
  const { data: verifyData } = useVerifyToken(token ?? "");

  const sseUrl =
    verifyData?.role === "USER"
      ? Endpoints.sse.connect(roomId).path
      : Endpoints.sse.connectParticipant().path;

  const handleMessage = useCallback((messageData: T) => {
    setData(messageData);
    setIsLoading(false);
    setError(null);
  }, []);

  const handleOpen = useCallback(() => {
    setIsConnected(true);
    setIsLoading(false);
    setError(null);
  }, []);

  const handleError = useCallback((errorData: any) => {
    setError(errorData);
    setIsConnected(false);
    // 에러가 발생해도 로딩은 false로 설정 (재연결 시도 중)
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!sseUrl || !token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsubscribe = subscribeToSSE(
      sseUrl,
      handleMessage,
      token,
      handleOpen,
      handleError,
      5000, // 5초 후 재연결 시도
    );

    return () => {
      unsubscribe();
      setIsConnected(false);
    };
  }, [sseUrl, token, handleMessage, handleOpen, handleError]);

  return {
    data,
    error,
    isLoading,
    isConnected,
  };
};
