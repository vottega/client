import { ParticipantResponseDTO, ParticipantRoleDTO } from "@/app/api/types/participant";
import { Role } from "@/constants/role";

export type CreateRoomRequest = {
  roomName: string;
  ownerId: number;
  participantRoleList: Role[];
};

export type RoomResponseDTO = {
  id: number;
  name: string;
  ownerId: number;
  status: RoomStatus;
  participants: ParticipantResponseDTO[];
  roles: ParticipantRoleDTO[];
  createdAt: string;
  lastUpdatedAt: string;
  startedAt: string | null;
  finishedAt: string | null;
};

export type RoomStatus = "NOT_STARTED" | "PROGRESS" | "FINISHED" | "STOPPED";
