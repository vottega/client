import { RoomList } from "@/components/RoomList";
import { Button } from "@/components/ui/button";
import { Main } from "@/components/ui/main";
import { Link } from "react-router-dom";

export default function RoomsPage() {
  return (
    <Main>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold md:text-2xl">회의실</h2>
        <Button asChild>
          <Link to="/rooms/new">회의실 만들기</Link>
        </Button>
      </div>
      <div
        className="flex flex-col flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm overflow-hidden"
        x-chunk="dashboard-02-chunk-1"
      >
        <RoomList />
      </div>
    </Main>
  );
}
