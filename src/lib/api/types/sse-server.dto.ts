import { RoomStatus } from "@/lib/api/types/room-service.dto";
import {
  VotePaperType,
  VoteResponseDTO as VoteResponseDTOFromVote,
} from "@/lib/api/types/vote-service.dto";
import { Role } from "./auth-service.dto";

type UUID = string;

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
  votedAt: string | null;
}

export interface VoteResponseDTO extends VoteResponseDTOFromVote {
  voteAction: VoteAction;
}

export type VoteAction = "EDIT" | "STATUS_CHANGE" | "RESET";

interface BaseSSEConnectionInfo {
  role: Role;
  roomId: number;
}

interface ParticipantSSEConnectionInfo extends BaseSSEConnectionInfo {
  role: "PARTICIPANT";
  participantId: UUID;
}

interface UserSSEConnectionInfo extends BaseSSEConnectionInfo {
  role: "USER";
  userId: number;
}

export type SSEConnectionInfo = ParticipantSSEConnectionInfo | UserSSEConnectionInfo;

interface BaseSSEHeaders {
  "X-Client-Role": Role;
  "X-Room-Id": string;
}

interface ParticipantSSEHeaders extends BaseSSEHeaders {
  "X-Client-Role": "PARTICIPANT";
  "X-Participant-Id": string;
}

interface UserSSEHeaders extends BaseSSEHeaders {
  "X-Client-Role": "USER";
  "X-User-Id": string;
}

export type SSEHeaders = ParticipantSSEHeaders | UserSSEHeaders;
