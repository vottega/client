import { RoomList } from "@/app/rooms/RoomList";
import TheHeader from "@/components/TheHeader";
import { Button } from "@/components/ui/button";
import { Main } from "@/components/ui/main";
import Link from "next/link";

export default function Rooms() {
  return (
    <>
      <TheHeader />
      <Main>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold md:text-2xl">회의실</h2>
          <Button asChild>
            <Link href="/rooms/new">회의실 만들기</Link>
          </Button>
        </div>
        <div
          className="flex flex-col flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm overflow-hidden"
          x-chunk="dashboard-02-chunk-1"
        >
          <RoomList />
        </div>
      </Main>
    </>
  );
}
