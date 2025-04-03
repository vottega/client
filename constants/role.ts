import { ParticipantRoleDTO } from "@/lib/api/types/room-service.dto";

export const ROLES: Roles = new Map([
  ["의장", { role: "의장", canVote: true }],
  ["회의자", { role: "회의자", canVote: true }],
  ["서기", { role: "서기", canVote: true }],
]);

export type Role = ParticipantRoleDTO;

export type Roles = Map<string, Role>;
