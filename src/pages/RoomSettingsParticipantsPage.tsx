import { RoomSettingsSidebar } from "@/components/RoomSettingsSidebar";
import { BreadcrumbHeader } from "@/components/BreadcrumbHeader";
import { ParticipantList } from "@/components/ParticipantList";
import { Main } from "@/components/ui/main";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TypographyH4 } from "@/components/ui/typography";
import { useParams } from "react-router-dom";

export default function RoomSettingsParticipantsPage() {
  const { id: roomId } = useParams<{ id: string }>();

  return (
    <SidebarProvider>
      <RoomSettingsSidebar />
      <SidebarInset className="max-w-full">
        <BreadcrumbHeader
          breadcrumbs={[
            { label: "내 회의실", href: "/rooms" },
            { label: "회의실 이름", href: `/rooms/${roomId}` },
            { label: "설정", href: `/rooms/${roomId}/settings` },
            { label: "참여자" },
          ]}
        />
        <Main>
          <ul>
            <li>
              <TypographyH4>참여자</TypographyH4>
              <ParticipantList />
            </li>
          </ul>
        </Main>
      </SidebarInset>
    </SidebarProvider>
  );
}
