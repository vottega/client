import { EventSourcePolyfill } from "event-source-polyfill";

export const subscribeToSSE = (url: string, onMessage: (data: any) => void, token: string) => {
  const eventSource = new EventSourcePolyfill(url, {
    headers: { Authorization: `Bearer ${token}` },
    heartbeatTimeout: 45000,
  });

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
