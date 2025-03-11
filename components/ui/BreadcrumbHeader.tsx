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
import { Fragment } from "react";

interface RoomHeaderProps {
  breadcrumbs?: {
    label: string;
    href?: string;
  }[];
  sidebarSide?: "left" | "right";
}

export const BreadcrumbHeader = ({ breadcrumbs = [], sidebarSide = "left" }: RoomHeaderProps) => {
  const { open, openMobile, isMobile } = useSidebar();
  const sidebarTriggerStyle = sidebarSide === "left" ? "" : "order-2 -mr-1 ml-auto rotate-180";

  return (
    <Header className="relative">
      {((!isMobile && !open) || (isMobile && !openMobile)) && (
        <SidebarTrigger className={sidebarTriggerStyle} />
      )}
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map(({ label, href }, idx) => (
            <Fragment key={label + href + idx}>
              <BreadcrumbItem>
                {href ? (
                  <BreadcrumbLink className="line-clamp-1" href={href}>
                    {label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="line-clamp-1">{label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {idx < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </Header>
  );
};
