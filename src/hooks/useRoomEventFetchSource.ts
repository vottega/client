import type {
  ParticipantResponseDTO,
  RoomResponseDTO,
  VotePaperDTO,
  VoteResponseDTO,
} from "@/lib/api/types/sse-server.dto";
import { getToken } from "@/lib/auth";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useEffect, useRef } from "react";

// Discriminated Union 패턴으로 타입 안전성 확보
type RoomEvent =
  | { type: "ROOM_INFO"; data: RoomResponseDTO }
  | { type: "PARTICIPANT_INFO"; data: ParticipantResponseDTO }
  | { type: "VOTE_INFO"; data: VoteResponseDTO }
  | { type: "VOTE_PAPER_INFO"; data: VotePaperDTO };

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
  const handlersRef = useRef(handlers);

  // 핸들러를 ref에 저장하여 최신 값 유지 (의존성 배열에서 제외)
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    // enabled가 false면 연결하지 않음
    if (options?.enabled === false) {
      return;
    }

    console.log("[SSE] Connecting to:", url);
    const controller = new AbortController();

    fetchEventSource(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        ...options?.headers,
      },
      signal: controller.signal,
      onmessage(ev) {
        try {
          const parsed = JSON.parse(ev.data) as RoomEvent;
          console.log("[SSE] Received:", parsed);

          // TypeScript의 타입 좁히기를 활용한 타입 안전한 분기 처리
          switch (parsed.type) {
            case "ROOM_INFO":
              handlersRef.current.ROOM_INFO?.(parsed.data);
              break;
            case "PARTICIPANT_INFO":
              handlersRef.current.PARTICIPANT_INFO?.(parsed.data);
              break;
            case "VOTE_INFO":
              handlersRef.current.VOTE_INFO?.(parsed.data);
              break;
            case "VOTE_PAPER_INFO":
              handlersRef.current.VOTE_PAPER_INFO?.(parsed.data);
              break;
            default: {
              // exhaustive check: 모든 케이스를 처리했는지 컴파일 타임에 검증
              const _exhaustiveCheck: never = parsed;
              console.warn(`[SSE] No handler for type:`, _exhaustiveCheck);
            }
          }
        } catch (err) {
          console.error("[SSE] Invalid message format", err);
        }
      },
      onerror(err) {
        console.error("[SSE] Connection error:", err);
        if (!options?.retry) {
          controller.abort();
        }
        throw err; // fetchEventSource가 재시도 로직을 처리하도록 에러를 throw
      },
      onclose() {
        console.warn("[SSE] Connection closed by server.");
      },
    });

    // cleanup: 컴포넌트 언마운트 또는 의존성 변경 시 연결 종료
    return () => {
      console.log("[SSE] Disconnecting from:", url);
      controller.abort();
    };
  }, [url, token, options?.enabled, options?.retry, options?.headers]);
}
