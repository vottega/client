import type { RoomEventType } from "@/lib/api/types/sse-server.dto";
import { getToken } from "@/lib/auth";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useEffect } from "react";

type RoomEvent<T = any> = {
  type: RoomEventType;
  data: T;
};

type RoomEventHandlers = {
  ROOM_INFO?: (data: any) => void;
  PARTICIPANT_INFO?: (data: any) => void;
  VOTE_INFO?: (data: any) => void;
  VOTE_PAPER_INFO?: (data: any) => void;
};

type Options = {
  headers?: Record<string, string>;
  retry?: boolean;
  enabled?: boolean;
};

export function useRoomEventFetchSource(
  url: string,
  handlers: RoomEventHandlers,
  options?: Options,
) {
  const token = getToken();

  useEffect(() => {
    // Only establish connection if enabled is true (defaults to true if not specified)
    if (options?.enabled === false) {
      return;
    }

    let controller = new AbortController();

    fetchEventSource(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options?.headers,
      },
      credentials: "include", // withCredentials equivalent
      onmessage(ev) {
        try {
          const parsed = JSON.parse(ev.data) as RoomEvent;
          const handler = handlers[parsed.type];
          if (handler) {
            handler(parsed.data);
          } else {
            console.warn(`[SSE] No handler for type: ${parsed.type}`);
          }
        } catch (err) {
          console.error("[SSE] Invalid message format", err);
        }
      },
      onerror(err) {
        console.error("[SSE] Connection error:", err);
        if (!options?.retry) controller.abort();
      },
      onclose() {
        console.warn("[SSE] Connection closed by server.");
      },
    });

    return () => {
      controller.abort();
    };
  }, [url, JSON.stringify(options?.headers), options?.enabled]);
}
