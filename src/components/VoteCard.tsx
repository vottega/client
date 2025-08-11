import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { VoteResponseDTO, VoteResult, VoteStatus } from "@/lib/api/types/vote-service.dto";
import { formatDateTime } from "@/lib/utils";
import { forwardRef, useMemo } from "react";

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

export const VoteCard = forwardRef<
  HTMLDivElement,
  {
    vote: VoteResponseDTO;
    children?: React.ReactNode;
  } & React.HTMLAttributes<HTMLDivElement>
>(({ vote, children, ...props }, ref) => {
  const { agendaName, finishedAt, reservedStartTime, createdAt, result, status } = vote;
  const message = useMemo(() => {
    if (finishedAt) return `${formatDateTime(finishedAt)} 종료`;
    if (reservedStartTime) return `${formatDateTime(reservedStartTime)} 예정`;
    return `${formatDateTime(createdAt)} 생성`;
  }, [finishedAt, reservedStartTime, createdAt]);

  return (
    <Card
      ref={ref}
      className="flex p-4 gap-4 justify-between cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
      {...props}
    >
      <CardHeader className="p-0">
        <CardTitle className="text-overflow text-base flex items-center gap-2">
          {agendaName}
          <VoteResultBadge voteResult={result} voteStatus={status} />
        </CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
});
