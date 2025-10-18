import type {
  ParticipantResponseDTO,
  RoomEventType,
  RoomResponseDTO,
  VotePaperDTO,
  VoteResponseDTO,
} from "@/lib/api/types/sse-server.dto";
import { getToken } from "@/lib/auth";
import { fetchEventSource } from "@microsoft/fetch-event-source";

type RoomEvent<T = unknown> = {
  type: RoomEventType;
  data: T;
};

type RoomEventHandlers = {
  ROOM_INFO?: (data: RoomResponseDTO) => void;
  PARTICIPANT_INFO?: (data: ParticipantResponseDTO) => void;
  VOTE_INFO?: (data: VoteResponseDTO) => void;
  VOTE_PAPER_INFO?: (data: VotePaperDTO) => void;
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

  if (options?.enabled === false) {
    return;
  }

  const controller = new AbortController();

  fetchEventSource(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
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
}
