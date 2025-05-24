interface SSEOptions extends EventSourceInit {
  headers?: Record<string, string>;
}

export const subscribeToSSE = (
  url: string,
  onMessage: (data: any) => void,
  options?: SSEOptions,
) => {
  // URL에 헤더 정보를 쿼리 파라미터로 추가
  const urlWithHeaders = new URL(url);
  if (options?.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      urlWithHeaders.searchParams.append(key, value);
    });
  }

  const { headers, ...eventSourceOptions } = options || {};
  const eventSource = new EventSource(urlWithHeaders.toString(), eventSourceOptions);

  eventSource.onmessage = (event) => {
    try {
      const parsed = JSON.parse(event.data);
      onMessage(parsed);
    } catch (e) {
      console.error("[SSE parse error]", e);
    }
  };

  eventSource.onerror = (err) => {
    console.error("[SSE error]", err);
    eventSource.close(); // auto-reconnect X
  };

  return () => {
    eventSource.close();
  };
};
