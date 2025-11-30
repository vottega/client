import type { RoomResponseDTO } from "@/lib/api/types/room-service.dto";
import type { ParticipantResponseDTO } from "@/lib/api/types/sse-server.dto";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";
import { queryKeys } from "../lib/api/queries";
import { useRoom } from "../lib/api/queries/room";
import { useAuthenticatedAuth } from "../lib/auth/useAuthenticatedAuth";
import { isNewerOrEqual } from "../lib/utils";

/**
 * 이벤트 처리 여부를 결정 (타임스탬프 기반 데이터 정합성 검증)
 * @returns true면 이벤트 처리 진행, false면 오래된 이벤트로 판단하여 무시
 */
const shouldProcessEvent = (
  action: ParticipantResponseDTO["action"],
  participant: RoomResponseDTO["participants"][0] | undefined,
  incomingData: ParticipantResponseDTO,
): boolean => {
  // ADD: 새 참여자이므로 항상 처리
  if (action === "ADD") {
    return true;
  }

  // 참여자가 없으면 처리하지 않음 (ADD 제외)
  if (!participant) {
    return false;
  }

  // ENTER, EXIT, EDIT, DELETE: lastUpdatedAt 기준으로 비교
  const isNewer = isNewerOrEqual(participant.lastUpdatedAt, incomingData.lastUpdatedAt);
  if (!isNewer) {
    console.debug(`오래된 ${action} 이벤트 무시:`, {
      current: participant.lastUpdatedAt,
      incoming: incomingData.lastUpdatedAt,
      participantId: incomingData.id,
    });
  }
  return isNewer;
};

export const useParticipantEventHandler = (roomId: string) => {
  const queryClient = useQueryClient();
  const { participantId } = useAuthenticatedAuth();
  const { data: room } = useRoom(roomId);

  return useCallback(
    (data: ParticipantResponseDTO) => {
      if (!room) {
        return;
      }

      const participant = room.participants.find((p) => p.id === data.id);

      // 타임스탬프 기반 데이터 정합성 검증 (한 번만 체크)
      if (!shouldProcessEvent(data.action, participant, data)) {
        return;
      }

      switch (data.action) {
        case "ENTER": {
          if (!participant) {
            console.debug("참여자 정보가 없어요.");
            return;
          }

          // React Query 캐시 업데이트: isEntered 상태 변경
          queryClient.setQueryData<RoomResponseDTO>(queryKeys.rooms.detail(roomId), (old) => {
            if (!old) return old;

            // 타임스탬프 이중 검증 (레이스 컨디션 방지)
            const currentParticipant = old.participants.find((p) => p.id === data.id);
            if (
              currentParticipant &&
              !isNewerOrEqual(currentParticipant.lastUpdatedAt, data.lastUpdatedAt)
            ) {
              console.debug("ENTER 캐시 업데이트 시 오래된 데이터 무시:", {
                current: currentParticipant.lastUpdatedAt,
                incoming: data.lastUpdatedAt,
                participantId: data.id,
              });
              return old;
            }

            return {
              ...old,
              participants: old.participants.map((p) =>
                p.id === data.id ? { ...p, isEntered: true, enteredAt: data.enteredAt } : p,
              ),
            };
          });

          if (participantId !== data.id) {
            toast(`${participant.name}님이 입장했어요.`, {
              description: data.enteredAt,
              action: {
                label: "현재 인원 보기",
                onClick: () => console.log("hello world"),
              },
            });
          }

          break;
        }

        case "EXIT": {
          if (!participant) {
            console.debug("참여자 정보가 없어요.");
            return;
          }

          // React Query 캐시 업데이트: isEntered 상태 변경
          queryClient.setQueryData<RoomResponseDTO>(queryKeys.rooms.detail(roomId), (old) => {
            if (!old) return old;

            // 타임스탬프 이중 검증 (레이스 컨디션 방지)
            const currentParticipant = old.participants.find((p) => p.id === data.id);
            if (
              currentParticipant &&
              !isNewerOrEqual(currentParticipant.lastUpdatedAt, data.lastUpdatedAt)
            ) {
              console.debug("EXIT 캐시 업데이트 시 오래된 데이터 무시:", {
                current: currentParticipant.lastUpdatedAt,
                incoming: data.lastUpdatedAt,
                participantId: data.id,
              });
              return old;
            }

            return {
              ...old,
              participants: old.participants.map((p) =>
                p.id === data.id
                  ? { ...p, isEntered: false, lastUpdatedAt: data.lastUpdatedAt ?? p.lastUpdatedAt }
                  : p,
              ),
            };
          });

          toast(`${participant.name}님이 퇴장했어요.`);
          break;
        }

        case "EDIT": {
          if (!participant) {
            console.debug("참여자 정보가 없어요.");
            return;
          }

          // React Query 캐시 업데이트: 참여자 정보 수정
          queryClient.setQueryData<RoomResponseDTO>(queryKeys.rooms.detail(roomId), (old) => {
            if (!old) return old;

            // 타임스탬프 이중 검증 (레이스 컨디션 방지)
            const currentParticipant = old.participants.find((p) => p.id === data.id);
            if (
              currentParticipant &&
              !isNewerOrEqual(currentParticipant.lastUpdatedAt, data.lastUpdatedAt)
            ) {
              console.debug("EDIT 캐시 업데이트 시 오래된 데이터 무시:", {
                current: currentParticipant.lastUpdatedAt,
                incoming: data.lastUpdatedAt,
                participantId: data.id,
              });
              return old;
            }

            return {
              ...old,
              participants: old.participants.map((p) =>
                p.id === data.id
                  ? {
                      ...p,
                      name: data.name ?? p.name,
                      position: data.position ?? p.position,
                      participantRole: data.participantRole ?? p.participantRole,
                      lastUpdatedAt: data.lastUpdatedAt ?? p.lastUpdatedAt,
                    }
                  : p,
              ),
            };
          });

          toast(`${participant.name}님의 정보가 수정되었어요.`);
          break;
        }

        case "ADD": {
          // ADD는 새로운 참여자이므로 currentRoom에 없을 수 있음
          // React Query 캐시 업데이트: 새 참여자 추가
          queryClient.setQueryData<RoomResponseDTO>(queryKeys.rooms.detail(roomId), (old) => {
            if (!old) return old;

            // 이미 존재하는지 확인
            const existingParticipant = old.participants.find((p) => p.id === data.id);
            if (existingParticipant) {
              // 이미 존재하는 경우, 타임스탬프 검증
              if (!isNewerOrEqual(existingParticipant.lastUpdatedAt, data.lastUpdatedAt)) {
                console.debug("ADD 캐시 업데이트 시 오래된 데이터 무시:", {
                  current: existingParticipant.lastUpdatedAt,
                  incoming: data.lastUpdatedAt,
                  participantId: data.id,
                });
                return old;
              }
              // 더 최신 데이터면 업데이트
              return {
                ...old,
                participants: old.participants.map((p) =>
                  p.id === data.id
                    ? {
                        ...p,
                        name: data.name,
                        position: data.position ?? p.position,
                        participantRole: data.participantRole ?? p.participantRole,
                        lastUpdatedAt: data.lastUpdatedAt ?? p.lastUpdatedAt,
                      }
                    : p,
                ),
              };
            }

            // 새 참여자 추가
            return {
              ...old,
              participants: [
                ...old.participants,
                {
                  id: data.id,
                  name: data.name,
                  roomId: data.roomId,
                  position: data.position ?? null,
                  participantRole: data.participantRole ?? { role: "", canVote: false },
                  isEntered: data.isEntered ?? false,
                  createdAt: data.createdAt,
                  enteredAt: data.enteredAt ?? null,
                  lastUpdatedAt: data.lastUpdatedAt ?? data.createdAt,
                },
              ],
            };
          });

          toast(`${data.name}님이 참여자로 추가되었어요.`, {
            action: {
              label: "참여자 목록 보기",
              onClick: () => console.log("참여자 목록 보기"),
            },
          });
          break;
        }

        case "DELETE": {
          if (!participant) {
            console.debug("참여자 정보가 없어요.");
            return;
          }

          // React Query 캐시 업데이트: 참여자 삭제
          queryClient.setQueryData<RoomResponseDTO>(queryKeys.rooms.detail(roomId), (old) => {
            if (!old) return old;

            // 타임스탬프 이중 검증 (레이스 컨디션 방지)
            const currentParticipant = old.participants.find((p) => p.id === data.id);
            if (
              currentParticipant &&
              !isNewerOrEqual(currentParticipant.lastUpdatedAt, data.lastUpdatedAt)
            ) {
              console.debug("DELETE 캐시 업데이트 시 오래된 데이터 무시:", {
                current: currentParticipant.lastUpdatedAt,
                incoming: data.lastUpdatedAt,
                participantId: data.id,
              });
              return old;
            }

            return {
              ...old,
              participants: old.participants.filter((p) => p.id !== data.id),
            };
          });

          toast(`${participant.name}님이 참여자에서 삭제되었어요.`);
          break;
        }
      }
    },
    [participantId, queryClient, roomId, room],
  );
};
