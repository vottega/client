import { Role } from "@/constants/role";

export type Participant = {
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
