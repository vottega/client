import { AppSidebar } from "@/app/rooms/[id]/AppSidebar";
import { Room } from "@/app/rooms/[id]/Room";
import { Avatars } from "@/components/liveblocks/Avatars";
import { Editor } from "@/components/liveblocks/Editor";
import { Status } from "@/components/liveblocks/Status";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Main } from "@/components/ui/main";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function Rooms({ params: { pageId } }: { params: { pageId: string } }) {
  console.log(pageId);
  return (
    <SidebarProvider>
      <SidebarInset className="max-w-full">
        <Header>
          <Header.Logo />
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
          <SidebarTrigger className="-mr-1 ml-auto rotate-180" />
        </Header>

        {/* contents */}
        <Main>
          <div className="flex w-full flex-col gap-4 md:gap-8 flex-grow">
            <Card className="grow-[2] flex flex-col max-w-full">
              <CardHeader>
                <CardTitle>속기</CardTitle>
                <CardDescription>회의 속기가 이루어지는 공간이에요.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow h-0">
                <Shorthand pageId={pageId} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>투표 정보</CardTitle>
                <CardDescription>현재 진행 중이거나, 진행 예정인 안건이에요.</CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="w-full h-[10vh]" />
              </CardContent>
            </Card>
          </div>
        </Main>
      </SidebarInset>

      <AppSidebar side="right" />
    </SidebarProvider>
  );
}

function Shorthand({ pageId }: { pageId: string }) {
  return (
    <Room pageId={pageId}>
      {/* Sticky header */}
      <div className="sticky top-0 left-0 right-0 h-[60px] flex items-center justify-between px-4 z-20">
        <div className="absolute top-3 left-3">
          <Status />
        </div>
        <div />
        <Avatars />
      </div>

      <Editor />
    </Room>
  );
}
