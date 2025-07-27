import type { VotePaperDTO } from "@/lib/api/types/sse-server.dto";
import { useCallback } from "react";

export const useVotePaperEventHandler = () => {
  return useCallback((data: VotePaperDTO) => {
    console.log("votePaperEventHandler", data);
  }, []);
};
