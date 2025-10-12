import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VoteCard } from "@/components/VoteCard";
import { useRoom } from "@/lib/api/queries/room";
import { useVoteDetail } from "@/lib/api/queries/vote";
import type { VoteResponseDTO } from "@/lib/api/types/vote-service.dto";
import { cn, formatDateTime } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Loader2, Vote } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useVotePermission } from "../hooks/useVotePermission";
import { useVerifyToken } from "../lib/api/queries/auth";
import { getToken } from "../lib/auth";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";
import { VotePaper } from "./VotePaper";

// 👥 참여자 타입 정의
export type Participant = {
  id: string;
  name: string;
  hasVoted: boolean;
  isOnline: boolean;
  votedAt?: string | null;
};

export type VoteLiveBoardProps = {
  roomId: string;
  vote: VoteResponseDTO;
};

export function VoteLiveBoard({ roomId, vote }: VoteLiveBoardProps) {
  const { data: room } = useRoom(roomId);
  const { data: voteDetail, refetch: refetchVoteDetail } = useVoteDetail(vote.id);
  const { data: verifyData } = useVerifyToken(getToken() ?? "");
  const hasPermission = useVotePermission({
    participantId: verifyData?.participantId ?? null,
    voteId: vote.id,
  });
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const votePaperList = useMemo(() => {
    return new Map(voteDetail?.votePaperList.map((p) => [p.userId, p]) ?? []);
  }, [voteDetail]);

  const participants: Participant[] = useMemo(() => {
    return (
      room?.participants
        .filter((p) => votePaperList.has(p.id))
        .map((p) => ({
          id: p.id,
          name: p.name,
          hasVoted: votePaperList.get(p.id)?.votePaperType !== "NOT_VOTED",
          isOnline: p.isEntered,
          votedAt: votePaperList.get(p.id)?.votedAt,
        })) ?? []
    );
  }, [room?.participants, votePaperList]);

  const participantMe = room?.participants.find((p) => p.id === verifyData?.participantId);
  const myName = verifyData?.role === "USER" ? verifyData?.userId : participantMe?.name;

  // 요약 수치 계산
  const total = votePaperList.size;
  const complete =
    voteDetail?.votePaperList.filter((p) => p.votePaperType !== "NOT_VOTED").length ?? 0;
  const percent = total ? Math.round((complete / total) * 100) : 0;

  const myVoteStatusMessage = hasPermission ? (
    votePaperList.get(participantMe?.id ?? "")?.votePaperType === "NOT_VOTED" ? (
      <div>
        {myName} 님이 투표하기를 기다리고 있어요.
        <VotePaper vote={vote} className="absolute right-6 top-1/2 -translate-y-1/2" />
      </div>
    ) : (
      <div>
        {myName} 님은{" "}
        <Badge variant="secondary">
          {formatDateTime(votePaperList.get(participantMe?.id ?? "")?.votedAt ?? "")}
        </Badge>{" "}
        에 투표를 완료했어요.
      </div>
    )
  ) : (
    `${myName} 님은 투표 권한이 없어요.`
  );

  const handleClickRefresh = useCallback(() => {
    refetchVoteDetail();
    setLastUpdated(new Date());
  }, [refetchVoteDetail]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <VoteCard vote={vote}>
          <Button variant="secondary">투표 현황</Button>
        </VoteCard>
      </DialogTrigger>

      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        {/* Header: LIVE status + stats */}
        <DialogHeader className="bg-white border-b p-6">
          <Alert className="mb-4" variant={hasPermission ? "default" : "destructive"}>
            <Vote className="w-4 h-4" />
            <AlertTitle>내 투표 현황</AlertTitle>
            <AlertDescription>{myVoteStatusMessage}</AlertDescription>
          </Alert>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-extrabold text-gray-900 flex gap-2">
              실시간 투표 현황
              <p className="flex text-base items-center gap-1 text-red-500 animate-pulse font-semibold">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>LIVE</span>
              </p>
            </DialogTitle>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            마지막 갱신: {formatDistanceToNow(lastUpdated, { addSuffix: true, locale: ko })}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            {[
              { label: "총 참여자", value: total },
              { label: "투표 완료", value: complete },
              { label: "진행률", value: `${percent}%` },
            ].map((item) => (
              <div key={item.label} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xl font-semibold text-gray-800">{item.value}</p>
                <p className="text-xs text-gray-500 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </DialogHeader>

        {/* Content: Grid of Participants */}
        <div className="p-6 bg-white grid grid-cols-3 gap-4 max-h-80 overflow-y-auto">
          {participants.map((p) => (
            <div
              key={p.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg shadow-sm transition hover:scale-105",
                p.hasVoted ? "bg-blue-100" : "bg-pink-100",
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    p.isOnline ? "bg-green-500" : "bg-gray-400",
                  )}
                ></span>
                <span className="text-sm font-medium text-gray-800 truncate">{p.name}</span>
              </div>
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full",
                  p.hasVoted ? "bg-blue-200 text-blue-800" : "bg-pink-200 text-pink-800",
                )}
              >
                {p.hasVoted ? "완료" : "대기"}
              </span>
            </div>
          ))}
        </div>

        {/* Footer: Refresh */}
        <DialogFooter className="p-4 bg-white flex justify-end">
          <Button variant="outline" onClick={handleClickRefresh}>
            새로고침
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
