import { useRoom } from "../api/queries/room";
import { useAuthByRole } from "./useAuthenticatedAuth";
import { ParticipantResponseDTO } from "../api/types/room-service.dto";

type UserMe = {
  role: "USER";
  id: number;
  userId: string;
  token: string;
};

type ParticipantMe = {
  role: "PARTICIPANT";
} & ParticipantResponseDTO;

export type MeInfo = UserMe | ParticipantMe;

export const useMe = (roomId: string): MeInfo | undefined => {
  const { data: room } = useRoom(roomId);
  const auth = useAuthByRole();

  if (auth.role === "USER") {
    return {
      ...auth,
      role: "USER" as const,
    };
  }

  if (!room || !auth.participantId) {
    return undefined;
  }

  const participant = room.participants.find((p) => p.id === auth.participantId);

  if (!participant) {
    return undefined;
  }

  return {
    role: "PARTICIPANT",
    ...participant,
  };
};
