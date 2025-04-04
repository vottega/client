import { RoomList } from "@/app/rooms/RoomList";
import TheHeader from "@/components/TheHeader";
import { Main } from "@/components/ui/main";

export default function Rooms() {
  return (
    <>
      <TheHeader />
      <Main>
        <div className="flex items-center">
          <h2 className="text-lg font-semibold md:text-2xl">회의실</h2>
        </div>
        <div
          className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
          x-chunk="dashboard-02-chunk-1"
        >
          <RoomList />
        </div>
      </Main>
    </>
  );
}
