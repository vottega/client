import { Button } from "@/components/ui/button";
import TheHeader from "@/components/TheHeader";
import { Main } from "@/components/ui/main";
import Link from "next/link";

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
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">아직 만든 회의실이 없어요.</h3>
            <p className="text-sm text-muted-foreground">
              회의실을 만들면 투표를 시작할 수 있어요.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/rooms/new">회의실 만들기</Link>
            </Button>
          </div>
        </div>
      </Main>
    </>
  );
}
