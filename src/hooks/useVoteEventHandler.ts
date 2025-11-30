import type { VoteResponseDTO } from "@/lib/api/types/sse-server.dto";
import type { VoteResponseDTO as VoteListItemDTO } from "@/lib/api/types/vote-service.dto";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";
import { queryKeys } from "../lib/api/queries";
import { getVoteStatusMessage, isNewerOrEqual } from "../lib/utils";

/**
 * 이벤트 처리 여부를 결정 (타임스탬프 기반 데이터 정합성 검증)
 * @returns true면 이벤트 처리 진행, false면 오래된 이벤트로 판단하여 무시
 */
const shouldProcessEvent = (
  action: VoteResponseDTO["voteAction"],
  vote: VoteListItemDTO | undefined,
  incomingData: VoteResponseDTO,
): boolean => {
  // STATUS_CHANGE: 새 투표이므로 항상 처리
  if (action === "STATUS_CHANGE" && vote === undefined) {
    return true;
  }

  // 투표가 없으면 처리하지 않음
  if (!vote) {
    console.debug("투표 정보가 없어요.");
    return false;
  }

  // lastUpdatedAt 기준으로 비교
  const isNewer = isNewerOrEqual(vote.lastUpdatedAt, incomingData.lastUpdatedAt);
  if (!isNewer) {
    console.debug(`오래된 ${action} 이벤트 무시:`, {
      current: vote.lastUpdatedAt,
      incoming: incomingData.lastUpdatedAt,
      voteId: incomingData.id,
    });
  }
  return isNewer;
};

export const useVoteEventHandler = (roomId: string) => {
  const queryClient = useQueryClient();

  return useCallback(
    (data: VoteResponseDTO) => {
      // 현재 투표 목록 가져오기
      const votes = queryClient.getQueryData<VoteListItemDTO[]>(queryKeys.votes.byRoom(roomId));

      if (!votes) {
        console.debug("투표 목록 정보가 없어요.");
        return;
      }

      const vote = votes.find((v) => v.id === data.id);

      // 타임스탬프 기반 데이터 정합성 검증
      if (!shouldProcessEvent(data.voteAction, vote, data)) {
        return;
      }

      switch (data.voteAction) {
        case "EDIT": {
          // React Query 캐시 업데이트: 투표 정보 수정
          queryClient.setQueryData<VoteListItemDTO[]>(queryKeys.votes.byRoom(roomId), (old) => {
            if (!old) return old;
            
            // 타임스탬프 이중 검증 (shouldProcessEvent에서 이미 체크했지만 캐시 업데이트 시점에 재확인)
            const existingVote = old.find((v) => v.id === data.id);
            if (existingVote && !isNewerOrEqual(existingVote.lastUpdatedAt, data.lastUpdatedAt)) {
              console.debug("EDIT 캐시 업데이트 시 오래된 데이터 무시:", {
                current: existingVote.lastUpdatedAt,
                incoming: data.lastUpdatedAt,
                voteId: data.id,
              });
              return old;
            }
            
            return old.map((v) => (v.id === data.id ? data : v));
          });

          // 투표 상세 캐시도 업데이트
          queryClient.invalidateQueries({ queryKey: queryKeys.votes.detail(data.id) });

          toast(`"${data.agendaName}" 투표 정보가 수정되었어요.`);
          break;
        }

        case "STATUS_CHANGE": {
          // React Query 캐시 업데이트: 투표 상태 변경
          queryClient.setQueryData<VoteListItemDTO[]>(queryKeys.votes.byRoom(roomId), (old) => {
            if (!old) return old;
            
            const existingVote = old.find((v) => v.id === data.id);
            
            // 새 투표인 경우 추가
            if (!existingVote) {
              return [...old, data];
            }
            
            // 기존 투표는 타임스탬프 비교 후 업데이트 (이중 검증)
            if (!isNewerOrEqual(existingVote.lastUpdatedAt, data.lastUpdatedAt)) {
              console.debug("STATUS_CHANGE 캐시 업데이트 시 오래된 데이터 무시:", {
                current: existingVote.lastUpdatedAt,
                incoming: data.lastUpdatedAt,
                voteId: data.id,
              });
              return old;
            }
            
            return old.map((v) => (v.id === data.id ? data : v));
          });

          // 투표 상세 캐시도 업데이트
          queryClient.invalidateQueries({ queryKey: queryKeys.votes.detail(data.id) });

          const statusMessage = getVoteStatusMessage(data.status, data.result);
          toast(`"${data.agendaName}" 투표 상태가 변경되었어요.`, {
            description: statusMessage ? `상태: ${statusMessage}` : undefined,
          });
          break;
        }

        case "RESET": {
          // React Query 캐시 업데이트: 투표 초기화
          queryClient.setQueryData<VoteListItemDTO[]>(queryKeys.votes.byRoom(roomId), (old) => {
            if (!old) return old;
            
            // 타임스탬프 이중 검증
            const existingVote = old.find((v) => v.id === data.id);
            if (existingVote && !isNewerOrEqual(existingVote.lastUpdatedAt, data.lastUpdatedAt)) {
              console.debug("RESET 캐시 업데이트 시 오래된 데이터 무시:", {
                current: existingVote.lastUpdatedAt,
                incoming: data.lastUpdatedAt,
                voteId: data.id,
              });
              return old;
            }
            
            return old.map((v) => (v.id === data.id ? data : v));
          });

          // 투표 상세 캐시도 업데이트 (투표용지 목록 초기화)
          queryClient.invalidateQueries({ queryKey: queryKeys.votes.detail(data.id) });

          toast(`"${data.agendaName}" 투표가 초기화되었어요.`);
          break;
        }
      }
    },
    [queryClient, roomId],
  );
};
