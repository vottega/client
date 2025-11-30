import { BreadcrumbHeader } from "@/components/BreadcrumbHeader";
import { RoomSettingsSidebar } from "@/components/RoomSettingsSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Main } from "@/components/ui/main";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { h4 } from "@/components/ui/typography";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "../components/ui/use-toast";
import { useRoom, useUpdateRoom } from "../lib/api/queries/room";

export default function RoomSettingsPage() {
  const { toast } = useToast();
  const { id: roomId } = useParams<{ id: string }>();
  const { data: room } = useRoom(roomId);
  const [roomName, setRoomName] = useState("");
  const { mutate: updateRoom } = useUpdateRoom();

  const handleUpdateRoomName = useCallback(() => {
    if (roomId) {
      updateRoom(
        { roomId, data: { roomName, status: null } },
        {
          onSuccess: () => {
            toast({
              title: "회의실 이름이 변경되었습니다.",
              description: `${room?.name} → ${roomName}`,
            });
          },
          onError: () => {
            toast({
              title: "회의실 이름 변경에 실패했습니다.",
              variant: "destructive",
            });
          },
        },
      );
    }
  }, [roomId, roomName, updateRoom, room?.name, toast]);

  useEffect(() => {
    if (room) {
      setRoomName(room.name);
    }
  }, [room]);

  return (
    <SidebarProvider>
      <RoomSettingsSidebar />
      <SidebarInset className="max-w-full">
        <BreadcrumbHeader
          breadcrumbs={[
            { label: "내 회의실", href: "/rooms" },
            { label: "회의실 이름", href: `/rooms/${roomId}` },
            { label: "설정" },
          ]}
        />
        <Main>
          <ul>
            <li className="space-y-4">
              <Label htmlFor="roomName" className={h4}>
                회의실 이름
              </Label>
              <div className="flex gap-2">
                <Input
                  id="roomName"
                  className="w-64"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
                <Button onClick={handleUpdateRoomName}>변경</Button>
              </div>
            </li>
          </ul>
        </Main>
      </SidebarInset>
    </SidebarProvider>
  );
}
