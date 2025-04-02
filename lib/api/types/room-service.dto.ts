export type ClientRole = "USER" | "PARTICIPANT";

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
  /** UUID */
  id: string;
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

export type RoomStatus = "NOT_STARTED" | "PROGRESS" | "FINISHED" | "STOPPED";
