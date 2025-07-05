import { AppSidebar, VoteForm } from "@/components/AppSidebar";
import { OnlineOffline } from "@/components/OnlineOffline";
import { VoteList } from "@/components/VoteList";
import { BreadcrumbHeader } from "@/components/BreadcrumbHeader";
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
import { useAuth } from "@/lib/auth/AuthContext";
import { useVoteDialog } from "@/hooks/useDialog.vote";
import { useRoom } from "@/lib/api/queries/room";
import { type ParticipantResponseDTO } from "@/lib/api/types/room-service.dto";
import {
  RoomEventType,
  type ParticipantResponseDTO as SSEParticipantResponseDTO,
} from "@/lib/api/types/sse-server.dto";
import { Plus, Settings } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { toast } from "sonner";
import { useSSE } from "@/hooks/useSSE";
import { getToken } from "@/lib/auth";
import { Endpoints } from "@/lib/api/endpoints";

export type SSEResponse = { type: RoomEventType; data: unknown };

export default function RoomDetailPage() {
  const { id: roomId } = useParams<{ id: string }>();
  const { role } = useAuth();
  const token = getToken();
  const [participants, setParticipants] = useState<ParticipantResponseDTO[]>([]);
  const participantsRef = useRef<ParticipantResponseDTO[]>([]);
  const [sseResponseQueue, setSseResponseQueue] = useState<SSEResponse[]>([]);

  const sseUrl = useMemo(() => {
    if (role == null || !roomId) return null;
    return role === "USER"
      ? Endpoints.sse.connect(roomId).toFullPath()
      : Endpoints.sse.connectParticipant().toFullPath();
  }, [role, roomId]);

  const {
    data: sseResponse,
    error: _error,
    isLoading: _isLoading,
  } = useSSE<SSEResponse>(roomId || "", sseUrl, token);

  const { data: room, error: _roomError, isLoading: _isRoomLoading } = useRoom(roomId);

  const { onFail, onSuccess, open, setOpen } = useVoteDialog();

  const handleSseResponse = useCallback(({ type, data }: SSEResponse) => {
    switch (type) {
      case "ROOM_INFO": {
        // TODO: 방 정보 업데이트 처리
        break;
      }
      case "PARTICIPANT_INFO": {
        const participant = data as SSEParticipantResponseDTO;
        switch (participant.action) {
          case "ENTER": {
            const index = participantsRef.current.findIndex((p) => p.id === participant.id);

            if (index === -1) {
              console.debug("참여자 정보가 없어요.");
              setSseResponseQueue((prev) => [...prev, { type, data }]);
              return;
            }

            setParticipants((prev) => {
              const newParticipants = [...prev];
              newParticipants[index].isEntered = true;
              return newParticipants;
            });

            toast(`${participantsRef.current[index].name}님이 입장했어요.`, {
              description: participant.enteredAt,
              action: {
                label: "현재 인원 보기",
                onClick: () => console.log("hello world"),
              },
            });
            break;
          }
        }
        break;
      }
      case "VOTE_INFO": {
        // TODO: 투표 정보 업데이트 처리
        break;
      }
      case "VOTE_PAPER_INFO": {
        // TODO: 투표 용지 정보 업데이트 처리
        break;
      }
    }
  }, []);

  useEffect(() => {
    if (room) {
      setParticipants(room.participants);
      participantsRef.current = room.participants;
    }
  }, [room]);

  useEffect(() => {
    if (!sseResponse) return;
    handleSseResponse(sseResponse);
  }, [sseResponse, setParticipants, handleSseResponse]);

  useEffect(() => {
    if (sseResponseQueue.length === 0) return;
    const [head, ...rest] = sseResponseQueue;
    setSseResponseQueue(rest);
    handleSseResponse(head);
  }, [sseResponseQueue, handleSseResponse]);

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
                <OnlineOffline participants={participants} />
              </CardContent>
            </Card>
          </div>
        </Main>
      </SidebarInset>

      <AppSidebar side="right" roomId={roomId} />
    </SidebarProvider>
  );
}
