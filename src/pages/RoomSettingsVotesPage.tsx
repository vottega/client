import { RoomSettingsSidebar } from "@/components/RoomSettingsSidebar";
import { BreadcrumbHeader } from "@/components/BreadcrumbHeader";
import { Main } from "@/components/ui/main";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TypographyH4 } from "@/components/ui/typography";
import { useParams } from "react-router-dom";

export default function RoomSettingsVotesPage() {
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
            { label: "투표" },
          ]}
        />
        <Main>
          <ul>
            <li className="space-y-4">
              <TypographyH4>투표 정보</TypographyH4>
            </li>
          </ul>
        </Main>
      </SidebarInset>
    </SidebarProvider>
  );
}
