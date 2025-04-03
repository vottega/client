import { RoomStatus } from "@/lib/api/types/room-service.dto";
import {
  VotePaperType,
  VoteResponseDTO as VoteResponseDTOFromVote,
} from "@/lib/api/types/vote-service.dto";
import { UUID } from "crypto";

export interface FractionVO {
  numerator: number;
  denominator: number;
}

export interface ParticipantResponseDTO {
  id: UUID;
  name: string | null;
  roomId: number;
  position: string | null;
  participantRole: ParticipantRoleDTO | null;
  isEntered: boolean | null;
  createdAt: string;
  enteredAt: string | null;
  lastUpdatedAt: string | null;
  action: Action;
}

export type Action = "ENTER" | "EXIT" | "EDIT" | "ADD" | "DELETE" | "UUID";

export interface ParticipantRoleDTO {
  role: string;
  canVote: boolean;
}

export interface ParticipantRoomDTO {
  roomId: number;
}

export type RoomEventType = "ROOM_INFO" | "PARTICIPANT_INFO" | "VOTE_INFO" | "VOTE_PAPER_INFO";

export interface RoomResponseDTO {
  id: number;
  name: string;
  ownerId: number;
  status: RoomStatus;
  roles: ParticipantRoleDTO[];
  createdAt: string;
  lastUpdatedAt: string;
  startedAt?: string;
  finishedAt?: string;
}

export interface VotePaperDTO {
  votePaperId: number;
  voteId: number;
  roomId: number;
  userId: UUID;
  userName: string;
  votePaperType: VotePaperType;
  createdAt: string;
  votedAt?: string;
}

export interface VoteResponseDTO extends VoteResponseDTOFromVote {
  voteAction: VoteAction;
}

export type VoteAction = "EDIT" | "STATUS_CHANGE" | "RESET";
