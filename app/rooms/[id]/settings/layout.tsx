import { RoomSettingsSidebar } from "@/app/rooms/[id]/settings/Sidebar";
import { BreadcrumbHeader } from "@/components/BreadcrumbHeader";
import { Main } from "@/components/ui/main";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id: roomId } = await params;

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
        <Main>{children}</Main>
      </SidebarInset>
    </SidebarProvider>
  );
}
