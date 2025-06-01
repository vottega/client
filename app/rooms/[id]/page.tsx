"use client";

import { AppSidebar, VoteForm } from "@/app/rooms/[id]/AppSidebar";
import { OnlineOffline } from "@/app/rooms/[id]/OnlineOffline";
import { Room } from "@/app/rooms/[id]/Room";
import { VoteList } from "@/app/rooms/[id]/VoteList";
import { BreadcrumbHeader } from "@/components/BreadcrumbHeader";
import { Avatars } from "@/components/liveblocks/Avatars";
import { Editor } from "@/components/liveblocks/Editor";
import { Status } from "@/components/liveblocks/Status";
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
import { Endpoints } from "@/lib/api/endpoints";
import { customFetch } from "@/lib/api/fetcher";
import { RoomResponseDTO, type ParticipantResponseDTO } from "@/lib/api/types/room-service.dto";
import {
  RoomEventType,
  type ParticipantResponseDTO as SSEParticipantResponseDTO,
} from "@/lib/api/types/sse-server.dto";
import { Plus, Settings } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { useSSE } from "@/hooks/useSSE";
import { getToken } from "@/lib/auth";

export type SSEResponse = { type: RoomEventType; data: unknown };

export default function Rooms({ params: { id: roomId } }: { params: { id: string } }) {
  const { role } = useAuth();
  const token = useMemo(() => getToken(), []);
  const [participants, setParticipants] = useState<ParticipantResponseDTO[]>([]);
  const participantsRef = useRef<ParticipantResponseDTO[]>([]);
  const [sseResponseQueue, setSseResponseQueue] = useState<SSEResponse[]>([]);

  const getRoom = useCallback(
    (url: string) =>
      customFetch<RoomResponseDTO>(url, {
        method: "GET",
      }),
    [],
  );

  const sseUrl = useMemo(() => {
    return role === "USER"
      ? Endpoints.sse.connect(roomId).toFullPath()
      : Endpoints.sse.connectParticipant().toFullPath();
  }, [role, roomId]);

  const { data: sseResponse, error, isLoading } = useSSE<SSEResponse>(roomId, sseUrl, token ?? "");

  const {
    data: room,
    error: roomError,
    isLoading: isRoomLoading,
  } = useSWR(Endpoints.room.get(roomId).toFullPath(), getRoom);

  const { onFail, onSuccess, open, setOpen } = useVoteDialog();

  const handleSseResponse = useCallback(({ type, data }: SSEResponse) => {
    switch (type) {
      case "ROOM_INFO": {
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
          }
        }
      }
      case "VOTE_INFO": {
      }
      case "VOTE_PAPER_INFO": {
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

  return (
    <SidebarProvider>
      <SidebarInset className="max-w-full">
        <BreadcrumbHeader
          sidebarSide="right"
          breadcrumbs={[{ label: "내 회의실", href: "/rooms" }, { label: room?.name }]}
          showLogo
        >
          <Button variant="ghost" asChild size="icon">
            <Link href={`/rooms/${roomId}/settings`}>
              <Settings />
              <span className="sr-only">설정</span>
            </Link>
          </Button>
        </BreadcrumbHeader>

        {/* contents */}
        <Main>
          <div className="flex w-full flex-col gap-4 md:gap-8 flex-grow">
            {/* <Card className="grow-[2] flex flex-col max-w-full">
              <CardHeader>
                <CardTitle>속기</CardTitle>
                <CardDescription>회의 속기가 이루어지는 공간이에요.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow h-0">
                <Shorthand pageId={pageId} />
              </CardContent>
            </Card> */}
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

function Shorthand({ pageId }: { pageId: string }) {
  return (
    <Room pageId={pageId}>
      {/* Sticky header */}
      <div className="sticky top-0 left-0 right-0 h-[60px] flex items-center justify-between px-4 z-20">
        <div className="absolute top-3 left-3">
          <Status />
        </div>
        <div />
        <Avatars />
      </div>

      <Editor />
    </Room>
  );
}
