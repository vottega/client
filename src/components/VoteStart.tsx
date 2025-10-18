import { useCallback } from "react";
import { useUpdateVoteStatus } from "../lib/api/queries/vote";
import { Button } from "./ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "./ui/item";
import { useToast } from "./ui/use-toast";

export function VoteStart({ voteId, roomId }: { voteId: number; roomId: string }) {
  const { mutate: updateVoteStatus } = useUpdateVoteStatus();
  const { toast } = useToast();

  const handleClickStartVote = useCallback(() => {
    updateVoteStatus(
      { voteId, data: { status: "STARTED" }, roomId },
      {
        onSuccess: () => {
          toast({
            title: "투표가 시작되었어요.",
            description: "구성원분들께 투표를 독려해주세요.",
          });
        },
        onError: (error) => {
          toast({
            title: "투표 시작 실패",
            description: error.message,
            variant: "destructive",
          });
        },
      },
    );
  }, [updateVoteStatus, voteId, roomId, toast]);

  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>투표 시작하기</ItemTitle>
        <ItemDescription>
          접속해있는 인원이 출석 필요 인원을 충족하면 투표를 시작할 수 있어요.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="default" size="sm" onClick={handleClickStartVote}>
          투표 시작
        </Button>
      </ItemActions>
    </Item>
  );
}
