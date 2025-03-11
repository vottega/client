"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { IdCard, Settings, UserCog, Vote } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    icon: IdCard,
  },
  {
    title: "투표",
    url: "votes",
    icon: Vote,
  },
];

export function RoomSettingsSidebar() {
  const pathname = usePathname();
  const settingCategory = pathname.endsWith("settings")
    ? ""
    : pathname.split("/").slice(-1).join("");

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
                  <SidebarMenuButton asChild isActive={settingCategory === item.url}>
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
