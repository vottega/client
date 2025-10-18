import { VoteCard } from "@/components/VoteCard";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { useVoteInfo } from "@/lib/api/queries/vote";
import type { VoteResponseDTO } from "@/lib/api/types/vote-service.dto";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { HTMLAttributes, useMemo } from "react";
import { VoteLiveBoard } from "./VoteLiveBoard";
import { VoteDetailDialog } from "./VoteDetailDialog";

interface VoteListProps extends HTMLAttributes<HTMLDivElement> {
  roomId: string;
}

const VoteCardDialog = ({ vote, roomId }: { vote: VoteResponseDTO; roomId: string }) => {
  return (
    <VoteDetailDialog vote={vote} roomId={roomId} showStartButton>
      <VoteCard vote={vote} />
    </VoteDetailDialog>
  );
};

const VoteCardFallback = ({ children }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="font-normal">{children || "아직 등록된 투표가 없어요."}</AlertTitle>
    </Alert>
  );
};

export const VoteList = ({ roomId, className, ...props }: VoteListProps) => {
  const { data: voteList = [] } = useVoteInfo(roomId);

  const upcomingVoteList = useMemo(
    () => voteList.filter((vote) => vote.status === "CREATED"),
    [voteList],
  );
  const endedVoteList = useMemo(
    () => voteList.filter((vote) => vote.status === "ENDED"),
    [voteList],
  );
  const startedVoteList = useMemo(
    () => voteList.filter((vote) => vote.status === "STARTED"),
    [voteList],
  );

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <Card className="bg-muted border-transparent">
        <CardHeader>
          <CardDescription>
            진행중인 투표 <span className="text-primary ml-1">{startedVoteList.length}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {startedVoteList.length === 0 ? (
            <VoteCardFallback>진행중인 투표가 없어요.</VoteCardFallback>
          ) : (
            startedVoteList.map((vote) => (
              <VoteLiveBoard key={vote.id} roomId={roomId} vote={vote} />
            ))
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="bg-muted border-transparent">
          <CardHeader>
            <CardDescription>
              예정된 투표 <span className="text-primary ml-1">{upcomingVoteList.length}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {upcomingVoteList.length === 0 ? (
              <VoteCardFallback>예정된 투표가 없어요.</VoteCardFallback>
            ) : (
              upcomingVoteList.map((vote) => (
                <VoteCardDialog key={vote.id} vote={vote} roomId={roomId} />
              ))
            )}
          </CardContent>
        </Card>

        <Card className="bg-muted border-transparent">
          <CardHeader>
            <CardDescription>
              종료된 투표 <span className="text-primary ml-1">{endedVoteList.length}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {endedVoteList.length === 0 ? (
              <VoteCardFallback>종료된 투표가 없어요.</VoteCardFallback>
            ) : (
              endedVoteList.map((vote) => (
                <VoteCardDialog key={vote.id} vote={vote} roomId={roomId} />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
