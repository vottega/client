import { Role } from "@/constants/role";

export type ParticipantResponseDTO = {
  id: string;
  name: string;
  roomId: string;
  position: string | null;
  participantRole: Role;
  isEntered: boolean;
  createdAt: string;
  enteredAt: string | null;
  lastUpdatedAt: string;
};

export type ParticipantRoleDTO = {
  role: string;
  canVote: boolean;
};
