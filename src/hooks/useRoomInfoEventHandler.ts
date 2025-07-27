import { useCallback } from "react";
import type { RoomResponseDTO } from "@/lib/api/types/sse-server.dto";

export const useRoomInfoEventHandler = () => {
  return useCallback((data: RoomResponseDTO) => {
    console.log("roomInfoEventHandler", data);
  }, []);
};
