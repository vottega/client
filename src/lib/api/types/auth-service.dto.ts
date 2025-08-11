export type Role = "USER" | "PARTICIPANT";

type UUID = string;

export interface ParticipantAuthRequestDTO {
  participantId: UUID;
}

export interface UserAuthRequestDTO {
  id: number;
  userId: string;
}

export interface AuthResponseDTO {
  token: string;
}

export interface ParticipantAuthResponseDTO extends AuthResponseDTO {
  roomId: number;
}

export interface JwtParticipantResponseDTO {
  uuid: string;
  roomId: number;
}

export interface JwtUserResponseDTO {
  id: number;
  userId: string;
}

export type JwtResponseDTO = JwtParticipantResponseDTO | JwtUserResponseDTO;

export interface VerifyRequestDTO {
  token: string;
}

export interface VerifyResponseDTO {
  role: Role;
  participantId: UUID | null;
  roomId: number | null;
  id: number | null;
  userId: string | null;
}
