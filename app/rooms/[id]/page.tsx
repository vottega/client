"use client";

import { APIErrorResponse } from "@/app/api/types";
import { RoomResponseDTO } from "@/app/api/types/room";
import { ParticipantResponseDTO, RoomEventType } from "@/app/api/types/sse-server.dto";
import { AppSidebar, VoteForm } from "@/app/rooms/[id]/AppSidebar";
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
import { useSSE } from "@/hooks/useSSE";
import { Plus, Settings } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export default function Rooms({ params: { id: roomId } }: { params: { id: string } }) {
  const {
    data: sseResponse,
    error,
    isLoading,
  } = useSSE<{ type: RoomEventType; data: unknown }>(
    roomId,
    `http://localhost:8084/sse/room/${roomId}/43ba2e8c-c67d-47e4-8a40-beead7f16507`,
  );

  const getRoom = async (url: string) => {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const data: RoomResponseDTO | APIErrorResponse = await response.json();

    if (!response.ok) {
      // TODO: 에러처리 및 에러UI
      return null;
    }

    return data as RoomResponseDTO;
  };

  const {
    data: room,
    error: roomError,
    isLoading: isRoomLoading,
  } = useSWR(`http://localhost:8082/api/room/${roomId}`, getRoom);

  useEffect(() => {
    if (sseResponse) {
      const { type, data } = sseResponse;

      switch (type) {
        case "ROOM_INFO": {
        }
        case "PARTICIPANT_INFO": {
          const participant = data as ParticipantResponseDTO;
          switch (participant.action) {
            case "ENTER": {
              toast(`${participant.name}님이 입장했어요.`, {
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
    }
  }, [sseResponse]);

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
                <Dialog>
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
                    <VoteForm />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <VoteList />
              </CardContent>
            </Card>
          </div>
        </Main>
      </SidebarInset>

      <AppSidebar side="right" />
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
