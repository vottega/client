import { subscribeToSSE } from "@/lib/api/sse";
import { SSEConnectionInfo } from "@/lib/api/types/sse-server.dto";
import { useEffect, useState } from "react";

export function useSSE<T>(
  key: string,
  url: string | null,
  connectionInfo: SSEConnectionInfo | null,
) {
  console.log("useSSE: url", url);
  console.log("useSSE: connectionInfo", connectionInfo);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // URL이나 연결 정보가 없으면 연결하지 않음
    if (!url || !connectionInfo) {
      return;
    }

    setIsLoading(true);

    // 역할에 따른 헤더 설정
    const headers: Record<string, string> = {
      "X-Client-Role": connectionInfo.role,
    };

    if (connectionInfo.role === "PARTICIPANT") {
      headers["X-Participant-Id"] = connectionInfo.participantId;
      headers["X-Room-Id"] = connectionInfo.roomId.toString();
    } else {
      headers["X-User-Id"] = connectionInfo.userId.toString();
    }

    console.log("headers", headers);

    const unsubscribe = subscribeToSSE(
      url,
      (parsedData) => {
        setData(parsedData as T);
        setIsLoading(false);
      },
      {
        headers,
      },
    );

    return () => {
      unsubscribe();
    };
  }, [key, url, connectionInfo]);

  return { data, error, isLoading };
}
