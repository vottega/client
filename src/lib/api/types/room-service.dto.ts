export type ClientRole = "USER" | "PARTICIPANT";

type UUID = string;

export interface CreateRoomRequestDTO {
  roomName: string;
  ownerId: number;
  participantRoleList: ParticipantRoleDTO[];
}

export interface ParticipantInfoDTO {
  name: string;
  phoneNumber: string | null;
  position: string | null;
  role: string | null;
}

export interface ParticipantResponseDTO {
  id: UUID;
  name: string;
  roomId: number;
  position: string | null;
  participantRole: ParticipantRoleDTO;
  isEntered: boolean;
  createdAt: string;
  enteredAt: string | null;
  lastUpdatedAt: string;
}

export interface ParticipantRoleDTO {
  role: string;
  canVote: boolean;
}

export interface ParticipantRoomDTO {
  roomId: number;
}

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

export interface UpdateRoomRequestDTO {
  roomName: string | null;
  status: RoomStatus | null;
}

export const ROOM_STATUS = {
  NOT_STARTED: "NOT_STARTED",
  PROGRESS: "PROGRESS",
  FINISHED: "FINISHED",
  STOPPED: "STOPPED",
} as const;

export type RoomStatus = (typeof ROOM_STATUS)[keyof typeof ROOM_STATUS];
