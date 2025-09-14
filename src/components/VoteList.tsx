import { VoteInfo } from "@/components/AppSidebar";
import { VoteCard } from "@/components/VoteCard";
import { VotePaper } from "@/components/VotePaper";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVoteDialog } from "@/hooks/useDialog.vote";
import { useVoteInfo } from "@/lib/api/queries/vote";
import type { VoteResponseDTO } from "@/lib/api/types/vote-service.dto";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { HTMLAttributes, useMemo } from "react";
import { VoteLiveBoard } from "./VoteLiveBoard";

interface VoteListProps extends HTMLAttributes<HTMLDivElement> {
  roomId: string;
}

const VoteCardDialog = ({ vote, roomId }: { vote: VoteResponseDTO; roomId: string }) => {
  const { onFail, onSuccess, open, setOpen } = useVoteDialog();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <VoteCard vote={vote} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex-row items-center gap-2">
          <DialogTitle>투표 정보</DialogTitle>
          <DialogDescription>
            {vote.status === "ENDED" || vote.status === "STARTED"
              ? "완료된 투표 정보와 결과를 조회할 수 있어요"
              : "대기 중인 투표 정보를 조회 및 수정할 수 있어요."}
          </DialogDescription>
        </DialogHeader>
        {vote.status === "ENDED" ? (
          <Tabs defaultValue="info">
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="info">투표 정보</TabsTrigger>
              <TabsTrigger value="result">투표 결과</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <VoteInfo existingVote={vote} onFail={onFail} onSuccess={onSuccess} roomId={roomId} />
            </TabsContent>
            <TabsContent value="result">
              {/* TODO: 투표 결과 */}
              <p>투표 결과</p>
            </TabsContent>
          </Tabs>
        ) : (
          <VoteInfo existingVote={vote} onFail={onFail} onSuccess={onSuccess} roomId={roomId} />
        )}
      </DialogContent>
    </Dialog>
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
            startedVoteList.map((vote) =>
              vote.isVoted ? (
                <VoteLiveBoard roomId={roomId} vote={vote} />
              ) : (
                <VotePaper vote={vote} key={vote.id} />
              ),
            )
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
          <CardContent>
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
