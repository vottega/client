import { RoomHeader } from "@/app/rooms/[id]/Header";
import { Main } from "@/components/ui/main";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Settings, UserCog, Vote } from "lucide-react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <RoomSettingsSidebar />
      <SidebarInset className="max-w-full">
        <RoomHeader />
        <Main>{children}</Main>
      </SidebarInset>
    </SidebarProvider>
  );
}

const items = [
  {
    title: "일반",
    url: "",
    icon: Settings,
  },
  {
    title: "참여자",
    url: "participants",
    icon: UserCog,
  },
  {
    title: "역할",
    url: "roles",
    icon: Vote,
  },
];

export function RoomSettingsSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="h-16 justify-center items-end">
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>회의실 설정</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={`/rooms/1/settings/${item.url}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
