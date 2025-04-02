"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BaseHeader } from "@/components/Header.Base";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Fragment, memo, useMemo } from "react";

interface RoomHeaderProps {
  breadcrumbs?: {
    label?: string;
    href?: string;
  }[];
  sidebarSide?: "left" | "right";
}

export const BreadcrumbHeader = ({ breadcrumbs = [], sidebarSide = "left" }: RoomHeaderProps) => {
  const { open, openMobile, isMobile } = useSidebar();
  const sidebarTriggerStyle = sidebarSide === "left" ? "" : "order-2 -mr-1 ml-auto rotate-180";

  return (
    <BaseHeader className="relative">
      {((!isMobile && !open) || (isMobile && !openMobile)) && (
        <SidebarTrigger className={sidebarTriggerStyle} />
      )}
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map(({ label, href }, idx) => (
            <Fragment key={idx}>
              <BreadcrumbItem>
                <RoomName label={label} href={href} />
              </BreadcrumbItem>
              {idx < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </BaseHeader>
  );
};

const RoomName = memo(({ label, href }: { label?: string; href?: string }) => {
  if (!label) {
    return <Skeleton className="w-10 h-5" />;
  }

  if (!href) {
    return <BreadcrumbPage className="line-clamp-1">{label}</BreadcrumbPage>;
  }

  return (
    <BreadcrumbLink className="line-clamp-1" href={href}>
      {label}
    </BreadcrumbLink>
  );
});
RoomName.displayName = "Room Name Breadcrumb";
