import type { RoomResponseDTO as RoomCacheDTO } from "@/lib/api/types/room-service.dto";
import type { RoomResponseDTO } from "@/lib/api/types/sse-server.dto";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";
import { queryKeys } from "../lib/api/queries";
import { useRoom } from "../lib/api/queries/room";
import { isNewerOrEqual } from "../lib/utils";

export const useRoomInfoEventHandler = (roomId: string) => {
  const queryClient = useQueryClient();
  const { data: room } = useRoom(roomId);

  return useCallback(
    (data: RoomResponseDTO) => {
      if (!room) {
        return;
      }

      // 타임스탬프 기반 데이터 정합성 검증
      if (!isNewerOrEqual(room.lastUpdatedAt, data.lastUpdatedAt)) {
        console.debug("오래된 ROOM_INFO 이벤트 무시:", {
          current: room.lastUpdatedAt,
          incoming: data.lastUpdatedAt,
          roomId: data.id,
        });
        return;
      }

      // 변경 사항 감지
      const hasStatusChanged = room.status !== data.status;
      const hasNameChanged = room.name !== data.name;
      const hasRolesChanged = JSON.stringify(room.roles) !== JSON.stringify(data.roles);

      // React Query 캐시 업데이트: 방 정보 수정
      queryClient.setQueryData<RoomCacheDTO>(queryKeys.rooms.detail(roomId), (old) => {
        if (!old) return old;
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
