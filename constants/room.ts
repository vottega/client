import { RoomStatus } from "@/lib/api/types/room-service.dto";

export const badgeColor = {
  NOT_STARTED: "bg-sky-500",
  FINISHED: "bg-neutral-500",
  PROGRESS: "bg-green-500",
  STOPPED: "bg-amber-500",
} satisfies Record<RoomStatus, string>;

export const roomStatusMessage = {
  NOT_STARTED: "대기",
  FINISHED: "종료",
  PROGRESS: "진행 중",
  STOPPED: "중지",
} satisfies Record<RoomStatus, string>;
