import { Participant } from "@/app/api/types/participant";
import { Role } from "@/constants/role";

export type CreateRoomRequest = {
  roomName: string;
  ownerId: number;
  participantRoleList: Role[];
};

export type CreateRoomResponse = {
  id: number;
  name: string;
  ownerId: number;
  status: RoomStatus;
  participants: Participant[];
  roles: Role[];
  createdAt: string;
  lastUpdatedAt: string;
  startedAt: string | null;
  finishedAt: string | null;
};

export type RoomStatus = "NOT_STARTED" | "PROGRESS" | "FINISHED" | "STOPPED";
