import { useVoteDetail } from "@/lib/api/queries/vote";
import { useMemo } from "react";

interface UseVotePermissionProps {
  participantId: string | null;
  voteId: number;
}

export const useVotePermission = ({ participantId, voteId }: UseVotePermissionProps) => {
  const { data: vote } = useVoteDetail(voteId);
  const votePaperList = useMemo(() => {
    return new Map(vote?.votePaperList.map((p) => [p.userId, p]) ?? []);
  }, [vote]);

  if (participantId === null || !votePaperList.has(participantId)) {
    return false;
  }

  return true;
};
