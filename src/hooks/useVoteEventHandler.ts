import type { VoteResponseDTO } from "@/lib/api/types/sse-server.dto";
import { useCallback } from "react";

export const useVoteEventHandler = () => {
  return useCallback((data: VoteResponseDTO) => {
    console.log("voteEventHandler", data);
  }, []);
};
