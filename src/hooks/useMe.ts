import { useVerifyToken } from "../lib/api/queries/auth";
import { getToken } from "../lib/auth";
import { useRoom } from "../lib/api/queries/room";

export const useMe = ({ roomId }: { roomId: string }) => {
  const { data: room } = useRoom(roomId);
  const { data: verifyData } = useVerifyToken(getToken() ?? "");

  if (verifyData?.role === "USER") {
    return verifyData?.userId;
  }

  const me = verifyData?.participantId
    ? room?.participants.find((p) => p.id === verifyData?.participantId)
    : verifyData?.userId;
  return me;
};
