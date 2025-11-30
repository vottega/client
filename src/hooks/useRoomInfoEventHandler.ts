import type { RoomResponseDTO as RoomCacheDTO } from "@/lib/api/types/room-service.dto";
import type { RoomResponseDTO } from "@/lib/api/types/sse-server.dto";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";
import { queryKeys } from "../lib/api/queries";
import { useRoom } from "../lib/api/queries/room";
import { isNewerOrEqual } from "../lib/utils";

/**
 * 이벤트 처리 여부를 결정 (타임스탬프 기반 데이터 정합성 검증)
 * @returns true면 이벤트 처리 진행, false면 오래된 이벤트로 판단하여 무시
 */
const shouldProcessEvent = (
  room: RoomCacheDTO | undefined,
  incomingData: RoomResponseDTO,
): boolean => {
  // 방 정보가 없으면 처리하지 않음
  if (!room) {
    return false;
  }

  // lastUpdatedAt 기준으로 비교
  const isNewer = isNewerOrEqual(room.lastUpdatedAt, incomingData.lastUpdatedAt);
  if (!isNewer) {
    console.debug("오래된 ROOM_INFO 이벤트 무시:", {
      current: room.lastUpdatedAt,
      incoming: incomingData.lastUpdatedAt,
      roomId: incomingData.id,
    });
  }
  return isNewer;
};

export const useRoomInfoEventHandler = (roomId: string) => {
  const queryClient = useQueryClient();
  const { data: room } = useRoom(roomId);

  return useCallback(
    (data: RoomResponseDTO) => {
      // 타임스탬프 기반 데이터 정합성 검증
      if (!shouldProcessEvent(room, data)) {
        return;
      }

      // TypeScript 타입 가드
      if (!room) {
        return;
      }

      // 변경 사항 감지
      const hasStatusChanged = room.status !== data.status;
      const hasNameChanged = room.name !== data.name;
      const hasRolesChanged = JSON.stringify(room.roles) !== JSON.stringify(data.roles);

      // React Query 캐시 업데이트: 방 정보 수정
      queryClient.setQueryData<RoomCacheDTO>(queryKeys.rooms.detail(roomId), (old) => {
        if (!old) return old;

        // 타임스탬프 이중 검증 (레이스 컨디션 방지)
        if (!isNewerOrEqual(old.lastUpdatedAt, data.lastUpdatedAt)) {
          console.debug("ROOM_INFO 캐시 업데이트 시 오래된 데이터 무시:", {
            current: old.lastUpdatedAt,
            incoming: data.lastUpdatedAt,
            roomId: data.id,
          });
          return old;
        }

        return {
          ...old,
          name: data.name,
          status: data.status,
          roles: data.roles,
          lastUpdatedAt: data.lastUpdatedAt,
          startedAt: data.startedAt ?? old.startedAt,
          finishedAt: data.finishedAt ?? old.finishedAt,
        };
      });

      // 변경 사항에 따른 알림
      if (hasStatusChanged) {
        const statusMap = {
          NOT_STARTED: "대기 중",
          PROGRESS: "진행 중",
          FINISHED: "종료",
          STOPPED: "중지됨",
        };
        toast("방 상태가 변경되었어요.", {
          description: `${statusMap[room.status]} → ${statusMap[data.status]}`,
        });
      }

      if (hasNameChanged) {
        toast("방 이름이 변경되었어요.", {
          description: `${room.name} → ${data.name}`,
        });
      }

      if (hasRolesChanged) {
        toast("참여자 역할이 변경되었어요.");
      }
    },
    [queryClient, roomId, room],
  );
};
