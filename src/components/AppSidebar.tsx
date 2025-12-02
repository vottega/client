import { Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useVoteDialog } from "@/hooks/useDialog.vote";
import { useCreateVote, useVoteInfo } from "@/lib/api/queries/vote";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useMemo } from "react";
import { useShowUserOnlyButton } from "../hooks/useShowUserOnlyButton";
import { useRoom } from "../lib/api/queries/room";
import type { VoteRequestDTO } from "../lib/api/types/vote-service.dto";
import { OnlineOffline } from "./OnlineOffline";
import { VoteResultBadge } from "./VoteCard";
import { VoteDetailDialog } from "./VoteDetailDialog";
import { VoteForm } from "./VoteForm";
import { NavUser } from "./NavUser";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  roomId: string;
}

export function AppSidebar({ roomId, ...props }: AppSidebarProps) {
  const { data: room } = useRoom(roomId);
  const { data: voteList = [] } = useVoteInfo(roomId);
  const { onError, onSuccess, open, setOpen } = useVoteDialog();
  const { mutate: createVote } = useCreateVote(roomId);
  const skeletonFill = useMemo(() => Math.max(5 - voteList.length, 0), [voteList]);
  const showUserOnlyButton = useShowUserOnlyButton();

  const handleSubmitVote = (data: VoteRequestDTO) => {
    createVote(data, {
      onSuccess,
      onError,
    });
  };
  return (
    <Sidebar className="hidden lg:flex h-svh border-l" {...props}>
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser roomId={roomId} />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <div className="flex flex-col flex-grow h-0">
          <CardHeader className="flex flex-row items-center sticky top-0 z-10 bg-sidebar p-4 md:py-6">
            <div className="grid">
              <CardTitle className="text-xl">안건 및 투표</CardTitle>
              <CardDescription>최근 진행한 투표예요.</CardDescription>
            </div>
            {showUserOnlyButton && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="ml-auto gap-1">
                    투표 생성
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>투표 생성하기</DialogTitle>
                  </DialogHeader>
                  <VoteForm roomId={roomId} onSubmit={handleSubmitVote} />
                </DialogContent>
              </Dialog>
            )}
          </CardHeader>
          <Table>
            <TableHeader className="sticky top-0 bg-sidebar z-10">
              <TableRow>
                <TableHead>안건명</TableHead>
                <TableHead className="text-right pl-0">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {voteList.map((vote, idx) => (
                <VoteDetailDialog
                  key={idx}
                  vote={vote}
                  roomId={roomId}
                  onSubmit={handleSubmitVote}
                  showStartButton={showUserOnlyButton}
                >
                  <TableRow className="h-0 cursor-pointer">
                    <TableCell className="font-medium">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-overflow">{vote.agendaName}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{vote.reservedStartTime?.slice(0, 10) ?? ""}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right pl-0 pr-2">
                      <VoteResultBadge voteResult={vote.result} voteStatus={vote.status} />
                    </TableCell>
                  </TableRow>
                </VoteDetailDialog>
              ))}
              {[...Array(skeletonFill)].map((_, idx) => (
                <TableRow key={voteList.length + idx + 1} className="relative h-[73px] z-0">
                  <TableCell>
                    <Skeleton className="h-[40px] w-full" />
                  </TableCell>
                  <TableCell className="text-right pl-0 pr-2">
                    <Skeleton className="h-[22px] w-full rounded-full" />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="sr-only">
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <SidebarSeparator className="mx-0" />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Dialog>
              <DialogTrigger asChild>
                <SidebarMenuButton>
                  <Users />
                  <span>현재 접속 인원</span>
                </SidebarMenuButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>현재 접속 인원</DialogTitle>
                  <DialogDescription className="flex justify-between items-center">
                    현재 접속 인원은 실시간으로 업데이트 됩니다.
                  </DialogDescription>
                </DialogHeader>
                <OnlineOffline participants={room?.participants ?? []} />
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
