import { useVerifyToken } from "../lib/api/queries/auth";
import { getToken } from "../lib/auth";
import { useRoom } from "../lib/api/queries/room";

export const useMe = ({ roomId }: { roomId: string }) => {
  const { data: room } = useRoom(roomId);
  const { data: verifyData } = useVerifyToken(getToken() ?? "");

  if (!verifyData) {
    return undefined;
  }

  if (verifyData.role === "USER") {
    return verifyData;
  }

  if (!room) {
    return undefined;
  }

  const me = room.participants.find((p) => p.id === verifyData.participantId) ?? null;

  return me;
};
