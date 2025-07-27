import type { ParticipantResponseDTO as ParticipantResponseDTOFromRoom } from "@/lib/api/types/room-service.dto";
import type { ParticipantResponseDTO } from "@/lib/api/types/sse-server.dto";
import { useCallback } from "react";
import { toast } from "sonner";

export const useParticipantEventHandler = (participants: ParticipantResponseDTOFromRoom[]) => {
  return useCallback((data: ParticipantResponseDTO) => {
    switch (data.action) {
      case "ENTER": {
        const index = participants.findIndex((p) => p.id === data.id);
        if (index === -1) {
          console.debug("참여자 정보가 없어요.");
          return;
        }
        toast(`${participants[index].name}님이 입장했어요.`, {
          description: data.enteredAt,
          action: {
            label: "현재 인원 보기",
            onClick: () => console.log("hello world"),
          },
        });
        break;
      }

      case "EXIT": {
        const index = participants.findIndex((p) => p.id === data.id);
        if (index === -1) {
          console.debug("참여자 정보가 없어요.");
          return;
        }
        break;
      }

      case "EDIT": {
        const index = participants.findIndex((p) => p.id === data.id);
        if (index === -1) {
          console.debug("참여자 정보가 없어요.");
          return;
        }
        break;
      }

      case "ADD": {
        const index = participants.findIndex((p) => p.id === data.id);
        if (index === -1) {
          console.debug("참여자 정보가 없어요.");
          return;
        }
        break;
      }
    }
  }, []);
};
