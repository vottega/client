import { BreadcrumbHeader } from "@/components/BreadcrumbHeader";
import { RoleList } from "@/components/RoleList";
import { RoomSettingsSidebar } from "@/components/RoomSettingsSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Main } from "@/components/ui/main";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TypographyH4 } from "@/components/ui/typography";
import { useToast } from "@/components/ui/use-toast";
import { Roles } from "@/constants/role";
import { queryKeys } from "@/lib/api/queries";
import { roomApi, useRoom } from "@/lib/api/queries/room";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function RoomSettingsRolesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { id: roomId } = useParams<{ id: string }>();
  const { data: room } = useRoom(roomId);
  const [roles, setRoles] = useState<Roles>(new Map());

  const handleApplyRoles = useCallback(async () => {
    if (!roomId || !room) return;

    const originalRoles = new Map(room.roles.map((r) => [r.role, r]));
    const currentRoles = roles;

    // 삭제할 역할 찾기 (원본에는 있지만 현재에는 없는 것)
    const rolesToDelete = Array.from(originalRoles.keys()).filter(
      (role) => !currentRoles.has(role),
    );

    // 추가할 역할 찾기 (현재에는 있지만 원본에는 없는 것)
    const rolesToAdd = Array.from(currentRoles.keys()).filter((role) => !originalRoles.has(role));

    const totalChanges = rolesToDelete.length + rolesToAdd.length;

    if (totalChanges === 0) {
      toast({
        title: "변경사항이 없습니다.",
      });
      return;
    }

    // 모든 API 호출을 Promise 배열로 만들기
    const deletePromises = rolesToDelete.map((role) => roomApi.deleteRole({ roomId, role }));

    const addPromises = rolesToAdd.map((role) => {
      const roleInfo = currentRoles.get(role);
      if (!roleInfo) return Promise.reject(new Error(`Role info not found for ${role}`));
      return roomApi.addRole({ roomId, roleInfo });
    });

    // 모든 Promise를 합쳐서 실행
    const allPromises = [...deletePromises, ...addPromises];
    const results = await Promise.allSettled(allPromises);

    // 결과 집계
    const successCount = results.filter((result) => result.status === "fulfilled").length;
    const errorCount = results.filter((result) => result.status === "rejected").length;

    // Query 무효화하여 최신 데이터 가져오기
    queryClient.invalidateQueries({ queryKey: queryKeys.rooms.detail(roomId) });

    // Toast 표시
    if (errorCount === 0) {
      toast({
        title: "역할이 성공적으로 적용되었습니다.",
      });
    } else if (successCount === 0) {
      toast({
        title: "역할 적용에 실패했습니다.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "일부 변경사항이 적용되지 않았습니다.",
        description: `${successCount}/${totalChanges}개가 적용되었습니다.`,
        variant: "destructive",
      });
    }
  }, [roomId, room, roles, queryClient, toast]);

  useEffect(() => {
    if (room) {
      const rolesMap = new Map(room.roles.map((r) => [r.role, r]));
      setRoles(rolesMap);
    }
  }, [room]);

  return (
    <SidebarProvider>
      <RoomSettingsSidebar />
      <SidebarInset className="max-w-full">
        <BreadcrumbHeader
          breadcrumbs={[
            { label: "내 회의실", href: "/rooms" },
            { label: room?.name, href: `/rooms/${roomId}` },
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
              <Button className="block ml-auto" onClick={handleApplyRoles}>
                적용하기
              </Button>
            </li>
          </ul>
        </Main>
      </SidebarInset>
    </SidebarProvider>
  );
}
