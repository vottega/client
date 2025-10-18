import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useRooms } from "@/lib/api/queries/room";
import { ROOM_STATUS, RoomStatus } from "@/lib/api/types/room-service.dto";
import { useUserAuth } from "@/lib/auth/useAuthenticatedAuth";
import { formatDateTime } from "@/lib/utils";
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

export const RoomList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useUserAuth();
  const { data: rooms, isLoading, error, refetch } = useRooms(id);

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

  const handleClickRoom = (roomId: number) => () => {
    navigate(`/rooms/${roomId}`);
  };

  const handleRetry = () => {
    refetch();
    toast({
      title: "다시 시도 중",
      description: "회의실 목록을 다시 불러오고 있습니다.",
    });
  };

  const tabItems = useMemo(
    () =>
      [ROOM_STATUS.PROGRESS, ROOM_STATUS.NOT_STARTED, ROOM_STATUS.FINISHED].map((tab) => ({
        tab,
        tabRooms: rooms?.roomList.filter(({ status }) => status === tab) ?? [],
      })),
    [rooms],
  );

  // 에러 처리
  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  if (rooms === undefined || isLoading) {
    return <Loader message="회의실 정보 로딩중" />;
  }

  if (rooms && rooms.roomList.length === 0) {
    return <EmptyRoomList />;
  }

  return (
    <Tabs defaultValue="All" className="w-full flex-1 flex flex-col">
      <TabsList className="w-full grid grid-cols-4 mb-4 rounded-none">
        <TabsTrigger value="All">전체보기 {`(${rooms.roomList.length})`}</TabsTrigger>
        {tabItems.map(({ tab, tabRooms }, idx) => (
          <TabsTrigger key={`tab-${idx}`} value={tab}>
            {roomStatusMessage[tab]} {`(${tabRooms.length})`}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* TODO: 페이지네이션 추가 */}
      <TabsContent value="All">
        <ul className="w-full grid sm:grid-cols-2 xl:gap-6 p-4 gap-2">
          {rooms.roomList.map((room) => (
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
                    참가자 {room.participants.length}명
                    <span className="mx-2 hidden lg:inline">·</span>
                    <br className="lg:hidden" />
                    {formatDateTime(room.createdAt).slice(0, -3)}
                  </CardDescription>
                  <div className="text-sm flex gap-1 items-center">
                    <span className={`flex h-2 w-2 rounded-full ${badgeColor[room.status]}`} />
                    <span className="sm:hidden md:inline">{roomStatusMessage[room.status]}</span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </ul>
      </TabsContent>
      {tabItems.map(({ tab, tabRooms }, idx) => (
        <TabsContent key={`tab-${idx}`} value={tab}>
          {tabRooms.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="w-full grid sm:grid-cols-2 xl:gap-6 p-4 gap-2">
              {tabRooms.map((room) => (
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
                        참가자 {room.participants.length}명
                        <span className="mx-2 hidden md:inline">·</span>
                        <br className="md:hidden" />
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
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export const EmptyRoomList = () => {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <h3 className="text-2xl font-bold tracking-tight">아직 만든 회의실이 없어요.</h3>
      <p className="text-sm text-muted-foreground">회의실을 만들면 투표를 시작할 수 있어요.</p>
      <Button className="mt-4" asChild>
        <Link to="/rooms/new">회의실 만들기</Link>
      </Button>
    </div>
  );
};
