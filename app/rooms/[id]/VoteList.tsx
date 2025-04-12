"use client";

import { VoteInfo } from "@/app/rooms/[id]/AppSidebar";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Endpoints } from "@/lib/api/endpoints";
import { customFetch } from "@/lib/api/fetcher";
import type { VoteResponseDTO, VoteResult, VoteStatus } from "@/lib/api/types/vote-service.dto";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { HTMLAttributes, useCallback, useMemo } from "react";
import useSWR from "swr";

interface VoteListProps extends HTMLAttributes<HTMLDivElement> {
  roomId: string;
}

export const VoteResultBadge = ({
  voteResult,
  voteStatus,
}: {
  voteResult: VoteResult;
  voteStatus: VoteStatus;
}) => {
  const buttonVariant = useMemo(() => {
    switch (voteStatus) {
      case "CREATED":
        return "outline";
      case "STARTED":
        return "default";
      case "ENDED": {
        if (voteResult === "PASSED") return "secondary";
        if (voteResult === "REJECTED") return "destructive";
      }
    }
  }, [voteResult, voteStatus]);

  const statusMessage = useMemo(() => {
    switch (voteStatus) {
      case "CREATED":
        return "예정";
      case "STARTED":
        return "진행";
      case "ENDED": {
        if (voteResult === "PASSED") return "가결";
        if (voteResult === "REJECTED") return "부결";
      }
    }
  }, [voteResult, voteStatus]);

  return (
    <Badge className="text-xs whitespace-nowrap" variant={buttonVariant}>
      {statusMessage}
    </Badge>
  );
};

const VoteCard = ({ vote, roomId }: { vote: VoteResponseDTO; roomId: string }) => {
  const { agendaName, finishedAt, result, status } = vote;
  const { onFail, onSuccess, open, setOpen } = useVoteDialog();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="flex p-4 gap-4 justify-between cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground">
          <CardHeader className="p-0">
            <CardTitle className="text-overflow text-base">{agendaName}</CardTitle>
            <CardDescription>{finishedAt}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <VoteResultBadge voteResult={result} voteStatus={status} />
          </CardContent>
        </Card>
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
  const getVoteList = useCallback((url: string) => customFetch<VoteResponseDTO[]>(url), []);

  const {
    data: voteList = [],
    mutate: refreshVoteList,
    error,
    isLoading,
  } = useSWR(Endpoints.vote.getInfo(roomId).toFullPath(), getVoteList);

  // const [voteList, setVoteList] = useState<VoteResponseDTO[]>(sample);
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
            startedVoteList.map((vote) => <VoteCard key={vote.id} vote={vote} roomId={roomId} />)
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
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
              upcomingVoteList.map((vote) => <VoteCard key={vote.id} vote={vote} roomId={roomId} />)
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
              endedVoteList.map((vote) => <VoteCard key={vote.id} vote={vote} roomId={roomId} />)
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
