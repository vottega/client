import { RoomSettingsSidebar } from "@/components/RoomSettingsSidebar";
import { BreadcrumbHeader } from "@/components/BreadcrumbHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Main } from "@/components/ui/main";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { h4 } from "@/components/ui/typography";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function RoomSettingsPage() {
  const { id: roomId } = useParams<{ id: string }>();
  const [roomName, setRoomName] = useState("hello world");

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
                <Button>변경</Button>
              </div>
            </li>
          </ul>
        </Main>
      </SidebarInset>
    </SidebarProvider>
  );
}
