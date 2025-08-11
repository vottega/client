import { AppSidebar, VoteForm } from "@/components/AppSidebar";
import { BreadcrumbHeader } from "@/components/BreadcrumbHeader";
import { OnlineOffline } from "@/components/OnlineOffline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Main } from "@/components/ui/main";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { VoteList } from "@/components/VoteList";
import { useVoteDialog } from "@/hooks/useDialog.vote";
import { useParticipantEventHandler } from "@/hooks/useParticipantEventHandler";
import { useRoomEventFetchSource } from "@/hooks/useRoomEventFetchSource";
import { useRoomInfoEventHandler } from "@/hooks/useRoomInfoEventHandler";
import { useVoteEventHandler } from "@/hooks/useVoteEventHandler";
import { useVotePaperEventHandler } from "@/hooks/useVotePaperEventHandler";
import { Endpoints } from "@/lib/api/endpoints";
import { useVerifyToken } from "@/lib/api/queries/auth";
import { useRoom } from "@/lib/api/queries/room";
import { getToken } from "@/lib/auth";
import { Plus, Settings } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function RoomDetailPage() {
  const token = getToken();
  const { id: roomId } = useParams<{ id: string }>();
  const { data: room, isSuccess: isRoomSuccess } = useRoom(roomId);
  const { data: verifyData } = useVerifyToken(token ?? "");

  const roomInfoEventHandler = useRoomInfoEventHandler();
  const participantEventHandler = useParticipantEventHandler(room?.participants ?? []);
  const voteEventHandler = useVoteEventHandler();
  const votePaperEventHandler = useVotePaperEventHandler();

  const { onFail, onSuccess, open, setOpen } = useVoteDialog();

  const sseUrl =
    verifyData?.role === "USER"
      ? Endpoints.sse.connect(roomId ?? "").path
      : Endpoints.sse.connectParticipant().path;
  useRoomEventFetchSource(
    sseUrl,
    {
      ROOM_INFO: roomInfoEventHandler,
      PARTICIPANT_INFO: participantEventHandler,
      VOTE_INFO: voteEventHandler,
      VOTE_PAPER_INFO: votePaperEventHandler,
    },
    {
      enabled: isRoomSuccess,
    },
  );

  if (!roomId) {
    return <div>잘못된 접근입니다.</div>;
  }

  return (
    <SidebarProvider>
      <SidebarInset className="max-w-full">
        <BreadcrumbHeader
          sidebarSide="right"
          breadcrumbs={[{ label: "내 회의실", href: "/rooms" }, { label: room?.name }]}
          showLogo
        >
          <Button variant="ghost" asChild size="icon">
            <Link to={`/rooms/${roomId}/settings`}>
              <Settings />
              <span className="sr-only">설정</span>
            </Link>
          </Button>
        </BreadcrumbHeader>

        {/* contents */}
        <Main>
          <div className="flex w-full flex-col gap-4 md:gap-8 flex-grow">
            <Card className="flex-grow">
              <CardHeader className="flex-row items-center space-y-0">
                <CardTitle>투표 정보</CardTitle>
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
                    <VoteForm roomId={roomId} onFail={onFail} onSuccess={onSuccess} />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <VoteList roomId={roomId} />
              </CardContent>
            </Card>
            <Card className="flex-grow">
              <CardHeader className="flex-row items-center space-y-0">
                <CardTitle>참여중인 인원</CardTitle>
              </CardHeader>
              <CardContent>
                <OnlineOffline participants={room?.participants ?? []} />
              </CardContent>
            </Card>
          </div>
        </Main>
      </SidebarInset>

      <AppSidebar side="right" roomId={roomId} />
    </SidebarProvider>
  );
}
