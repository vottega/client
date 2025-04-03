"use client";

import { BaseHeader } from "@/components/Header.Base";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Fragment, HTMLAttributes, memo } from "react";

interface RoomHeaderProps extends HTMLAttributes<HTMLHeadElement> {
  breadcrumbs?: {
    label?: string;
    href?: string;
  }[];
  sidebarSide?: "left" | "right";
  showLogo?: boolean;
}

export const BreadcrumbHeader = ({
  breadcrumbs = [],
  sidebarSide = "left",
  showLogo = false,
  children,
}: RoomHeaderProps) => {
  const { open, openMobile, isMobile } = useSidebar();
  const sidebarTriggerStyle = sidebarSide === "left" ? "" : "order-2 -mr-1 ml-auto rotate-180";

  return (
    <BaseHeader>
      {((!isMobile && !open) || (isMobile && !openMobile)) && (
        <SidebarTrigger className={sidebarTriggerStyle} />
      )}
      {showLogo && <BaseHeader.Logo />}
      <Breadcrumb className="w-full">
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
      {children}
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
