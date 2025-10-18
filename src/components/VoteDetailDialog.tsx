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
import type { VoteRequestDTO, VoteResponseDTO } from "@/lib/api/types/vote-service.dto";
import { ReactNode } from "react";
import { VoteForm } from "./VoteForm";
import { VoteResultDetail } from "./VoteResultDetail";
import { VoteStart } from "./VoteStart";

interface VoteDetailDialogProps {
  vote: VoteResponseDTO;
  roomId: string;
  onSubmit?: (data: VoteRequestDTO) => void;
  showStartButton?: boolean;
  children: ReactNode;
}

export function VoteDetailDialog({
  vote,
  roomId,
  onSubmit,
  showStartButton = false,
  children,
}: VoteDetailDialogProps) {
  const { open, setOpen } = useVoteDialog();

  const getDescription = () => {
    if (vote.status === "ENDED" || vote.status === "STARTED") {
      return "완료된 투표 정보와 결과를 조회할 수 있어요";
    }
    return "대기 중인 투표 정보를 조회 및 수정할 수 있어요.";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex-row items-center gap-2">
          <DialogTitle>투표 정보</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        {vote.status === "ENDED" && (
          <Tabs defaultValue="info">
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="info">투표 정보</TabsTrigger>
              <TabsTrigger value="result">투표 결과</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <VoteForm existingVote={vote} roomId={roomId} onSubmit={onSubmit} disabled />
            </TabsContent>
            <TabsContent value="result">
              <VoteResultDetail voteId={vote.id} />
            </TabsContent>
          </Tabs>
        )}

        {vote.status === "CREATED" && (
          <>
            <VoteForm existingVote={vote} roomId={roomId} onSubmit={onSubmit} disabled />
            {showStartButton && <VoteStart voteId={vote.id} roomId={roomId} />}
          </>
        )}

        {vote.status === "STARTED" && (
          <VoteForm existingVote={vote} roomId={roomId} onSubmit={onSubmit} disabled />
        )}
      </DialogContent>
    </Dialog>
  );
}
