import { AppSidebar, VoteForm } from "@/app/rooms/[id]/AppSidebar";
import { RoomHeader } from "@/app/rooms/[id]/Header";
import { Room } from "@/app/rooms/[id]/Room";
import { VoteList } from "@/app/rooms/[id]/VoteList";
import { Avatars } from "@/components/liveblocks/Avatars";
import { Editor } from "@/components/liveblocks/Editor";
import { Status } from "@/components/liveblocks/Status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Main } from "@/components/ui/main";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Plus } from "lucide-react";

export default function Rooms({ params: { pageId } }: { params: { pageId: string } }) {
  console.log(pageId);
  return (
    <SidebarProvider>
      <SidebarInset className="max-w-full">
        <RoomHeader sidebarSide="right" />

        {/* contents */}
        <Main>
          <div className="flex w-full flex-col gap-4 md:gap-8 flex-grow">
            {/* <Card className="grow-[2] flex flex-col max-w-full">
              <CardHeader>
                <CardTitle>속기</CardTitle>
                <CardDescription>회의 속기가 이루어지는 공간이에요.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow h-0">
                <Shorthand pageId={pageId} />
              </CardContent>
            </Card> */}
            <Card className="flex-grow">
              <CardHeader className="flex-row items-center space-y-0">
                <CardTitle>투표 정보</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="ml-auto gap-1">
                      투표 생성
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>투표 생성하기</DialogTitle>
                    </DialogHeader>
                    <VoteForm />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <VoteList />
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
