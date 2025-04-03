import { VoteStatus } from "@/lib/api/types/vote-service.dto";
import { UUID } from "crypto";

export const endpoints = {
  room: {
    /** `POST` */
    create: () => "/api/room",

    /** `GET` */
    get: (roomId: number) => `/api/room/${roomId}`,

    /** `PATCH` */
    update: (roomId: number) => `/api/room/${roomId}`,

    /** `GET` */
    listByUser: (userId: number) => `/api/room/list/${userId}`,

    /** `PUT` */
    addRole: (roomId: number) => `/api/room/${roomId}/role`,

    /** `DELETE` */
    deleteRole: (roomId: number, role: string) => `/api/room/${roomId}/role/${role}`,
  },

  participant: {
    /** `PUT` */
    add: (roomId: number) => `/api/room/${roomId}/participants`,

    /** `PATCH` */
    update: (roomId: number, participantId: UUID) =>
      `/api/room/${roomId}/participants/${participantId}`,

    /** `DELETE` */
    delete: (roomId: number, participantId: UUID) =>
      `/api/room/${roomId}/participants/${participantId}`,

    /** `GET` */
    getRoomByParticipant: (participantId: UUID) => `/api/room/participants/${participantId}`,
  },

  vote: {
    /** `POST` */
    create: (roomId: number) => `/api/vote/${roomId}`,

    /** `GET` */
    getInfo: (roomId: number) => `/api/vote/${roomId}`,

    /** `GET` */
    getDetail: (voteId: number) => `/api/vote/${voteId}/detail`,

    /** `POST` */
    updateStatus: (voteId: number, status: VoteStatus) => `/api/vote/${voteId}/${status}`,

    /** `PUT` */
    submit: (voteId: number) => `/api/vote/${voteId}`,

    /** `POST` */
    reset: (voteId: number) => `/api/vote/${voteId}/reset`,
  },

  sse: {
    /** `GET` */
    connect: (roomId: number, userId: UUID) => `/sse/room/${roomId}/${userId}`,
  },
};
