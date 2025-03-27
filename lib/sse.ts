export const subscribeToSSE = (
  url: string,
  onMessage: (data: any) => void,
  options?: EventSourceInit,
) => {
  const eventSource = new EventSource(url, options);

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
