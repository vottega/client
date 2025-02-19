"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Header } from "@/components/ui/header";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

interface RoomHeaderProps {
  sidebarSide?: "left" | "right";
}

export const RoomHeader = ({ sidebarSide = "left" }: RoomHeaderProps) => {
  const { state } = useSidebar();
  const sidebarTriggerStyle = sidebarSide === "left" ? "" : "order-2 -mr-1 ml-auto rotate-180";

  return (
    <Header>
      {state === "collapsed" && <SidebarTrigger className={sidebarTriggerStyle} />}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="line-clamp-1" href="/rooms">
              내 회의실
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1">회의실 이름</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </Header>
  );
};
