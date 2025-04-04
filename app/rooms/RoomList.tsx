"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Endpoints } from "@/lib/api/endpoints";
import { customFetch } from "@/lib/api/fetcher";
import { RoomResponseDTO, RoomStatus } from "@/lib/api/types/room-service.dto";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export const RoomList = () => {
  const router = useRouter();

  const getRoom = (url: string) => customFetch(url);

  const { data: rooms } = useSWR<RoomResponseDTO[]>(
    Endpoints.room.listByUser(1).toFullPath(),
    getRoom,
  );

  const badgeColor = {
    NOT_STARTED: "bg-sky-500",
    FINISHED: "bg-neutral-500",
    PROGRESS: "bg-green-500",
    STOPPED: "bg-amber-500",
  } satisfies Record<RoomStatus, string>;

  const roomStatusMessage = {
    NOT_STARTED: "대기",
    FINISHED: "종료",
    PROGRESS: "진행 중",
    STOPPED: "중지",
  } satisfies Record<RoomStatus, string>;

  if (rooms === undefined) {
    // TODO: loading UI
    return <>loading...</>;
  }

  if (rooms.length === 0) {
    return <EmptyRoomList />;
  }

  const handleClickRoom = (roomId: number) => () => {
    router.push(`/rooms/${roomId}`);
  };

  return (
    <ul className="w-full grid grid-cols-2 p-4 gap-2">
      {rooms.map((room) => (
        <Card
          key={`${room.id}`}
          className="cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
          onClick={handleClickRoom(room.id)}
        >
          <CardHeader>
            <CardTitle>{room.name}</CardTitle>
            <div className="flex justify-between">
              <CardDescription>
                {room.ownerId} 님의 회의실
                <span className="mx-2">·</span>
                참가자 {room.participants.length}명<span className="mx-2">·</span>
                {formatDateTime(room.createdAt).slice(0, -3)}
              </CardDescription>
              <div className="text-sm flex gap-1 items-center">
                <span className={`flex h-2 w-2 rounded-full ${badgeColor[room.status]}`} />
                <span className="hidden lg:inline">{roomStatusMessage[room.status]}</span>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </ul>
  );
};

export const EmptyRoomList = () => {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <h3 className="text-2xl font-bold tracking-tight">아직 만든 회의실이 없어요.</h3>
      <p className="text-sm text-muted-foreground">회의실을 만들면 투표를 시작할 수 있어요.</p>
      <Button className="mt-4" asChild>
        <Link href="/rooms/new">회의실 만들기</Link>
      </Button>
    </div>
  );
};
