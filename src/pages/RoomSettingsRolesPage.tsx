import { RoomSettingsSidebar } from "@/components/RoomSettingsSidebar";
import { BreadcrumbHeader } from "@/components/BreadcrumbHeader";
import { RoleList } from "@/components/RoleList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Main } from "@/components/ui/main";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TypographyH4 } from "@/components/ui/typography";
import { ROLES, Roles } from "@/constants/role";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function RoomSettingsRolesPage() {
  const { id: roomId } = useParams<{ id: string }>();
  const [roles, setRoles] = useState<Roles>(ROLES);

  return (
    <SidebarProvider>
      <RoomSettingsSidebar />
      <SidebarInset className="max-w-full">
        <BreadcrumbHeader
          breadcrumbs={[
            { label: "내 회의실", href: "/rooms" },
            { label: "회의실 이름", href: `/rooms/${roomId}` },
            { label: "설정", href: `/rooms/${roomId}/settings` },
            { label: "역할" },
          ]}
        />
        <Main>
          <ul>
            <li className="space-y-4">
              <TypographyH4>참여자 역할</TypographyH4>
              <Card>
                <CardContent className="p-4">
                  <RoleList roles={roles} setRoles={setRoles} />
                </CardContent>
              </Card>
              <Button className="block ml-auto">적용하기</Button>
            </li>
          </ul>
        </Main>
      </SidebarInset>
    </SidebarProvider>
  );
}
