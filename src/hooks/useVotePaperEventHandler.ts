import type { VotePaperDTO } from "@/lib/api/types/sse-server.dto";
import type {
  VoteDetailResponseDTO,
  VoteResponseDTO as VoteListItemDTO,
} from "@/lib/api/types/vote-service.dto";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";
import { queryKeys } from "../lib/api/queries";
import { useAuthenticatedAuth } from "../lib/auth/useAuthenticatedAuth";
import { isNewerOrEqual } from "../lib/utils";

/**
 * 이벤트 처리 여부를 결정 (타임스탬프 기반 데이터 정합성 검증)
 * @returns true면 이벤트 처리 진행, false면 오래된 이벤트로 판단하여 무시
 */
const shouldProcessEvent = (
  votePaper: VoteDetailResponseDTO["votePaperList"][0] | undefined,
  incomingData: VotePaperDTO,
): boolean => {
  // 투표용지가 없으면 새로 추가된 것이므로 처리
  if (!votePaper) {
    return true;
  }

  // votedAt 기준으로 비교
  const isNewer = isNewerOrEqual(votePaper.votedAt, incomingData.votedAt);
  if (!isNewer) {
    console.debug("오래된 투표용지 이벤트 무시:", {
      current: votePaper.votedAt,
      incoming: incomingData.votedAt,
      votePaperId: incomingData.votePaperId,
    });
  }
  return isNewer;
};

export const useVotePaperEventHandler = (roomId: string) => {
  const queryClient = useQueryClient();
  const { participantId, userId } = useAuthenticatedAuth();

  return useCallback(
    (data: VotePaperDTO) => {
      // 현재 투표 상세 정보 가져오기
      const voteDetail = queryClient.getQueryData<VoteDetailResponseDTO>(
        queryKeys.votes.detail(data.voteId),
      );

      if (!voteDetail) {
        console.debug("투표 상세 정보가 없어요.");
        return;
      }

      const votePaper = voteDetail.votePaperList.find((vp) => vp.votePaperId === data.votePaperId);

      // 타임스탬프 기반 데이터 정합성 검증
      if (!shouldProcessEvent(votePaper, data)) {
        return;
      }

      // React Query 캐시 업데이트: 투표용지 목록 업데이트
      queryClient.setQueryData<VoteDetailResponseDTO>(
        queryKeys.votes.detail(data.voteId),
        (old) => {
          if (!old) return old;

          const existingPaper = old.votePaperList.find(
            (vp) => vp.votePaperId === data.votePaperId,
          );

          let updatedPaperList: VoteDetailResponseDTO["votePaperList"];

          if (!existingPaper) {
            // 새 투표용지 추가
            updatedPaperList = [...old.votePaperList, data];
          } else {
            // 타임스탬프 이중 검증 (레이스 컨디션 방지)
            if (!isNewerOrEqual(existingPaper.votedAt, data.votedAt)) {
              console.debug("VOTE_PAPER 캐시 업데이트 시 오래된 데이터 무시:", {
                current: existingPaper.votedAt,
                incoming: data.votedAt,
                votePaperId: data.votePaperId,
              });
              return old;
            }
            
            // 기존 투표용지 업데이트
            updatedPaperList = old.votePaperList.map((vp) =>
              vp.votePaperId === data.votePaperId ? data : vp,
            );
          }

          return {
            ...old,
            votePaperList: updatedPaperList,
          };
        },
      );

      // 투표 목록 캐시도 업데이트 (isVoted 상태 변경)
      const isMyVote = data.userId === participantId || data.userId === String(userId);
      if (isMyVote && data.votePaperType !== "NOT_VOTED") {
        queryClient.setQueryData<VoteListItemDTO[]>(queryKeys.votes.byRoom(roomId), (old) => {
          if (!old) return old;
          return old.map((v) => (v.id === data.voteId ? { ...v, isVoted: true } : v));
        });
      }

      // Toast 알림
      if (isMyVote) {
        if (data.votePaperType === "NOT_VOTED") {
          toast("투표가 취소되었어요.");
        } else {
          const voteTypeText =
            data.votePaperType === "YES" ? "찬성" : data.votePaperType === "NO" ? "반대" : "기권";
          toast(`투표가 제출되었어요.`, {
            description: `${voteTypeText}으로 투표했어요.`,
          });
        }
      } else {
        if (data.votePaperType !== "NOT_VOTED") {
          toast(`${data.userName}님이 투표했어요.`);
        }
      }
    },
    [queryClient, roomId, participantId, userId],
  );
};
