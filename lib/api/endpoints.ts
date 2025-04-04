import { VoteStatus } from "@/lib/api/types/vote-service.dto";
import { UUID } from "crypto";

class Endpoint {
  endpoint: string;
  base: string;

  constructor(endpoint: string, base: string) {
    this.endpoint = endpoint;
    this.base = base;
  }

  get path() {
    return this.endpoint;
  }

  toFullPath() {
    return new URL(this.endpoint, this.base).toString();
  }
}

export const Endpoints = {
  room: {
    /** `POST` */
    create: () => new Endpoint("/api/room", baseUrlMap.room),

    /** `GET` */
    get: (roomId: number | string) => new Endpoint(`/api/room/${roomId}`, baseUrlMap.room),

    /** `PATCH` */
    update: (roomId: number | string) => new Endpoint(`/api/room/${roomId}`, baseUrlMap.room),

    /** `GET` */
    listByUser: (userId: number | string) =>
      new Endpoint(`/api/room/list/${userId}`, baseUrlMap.room),

    /** `PUT` */
    addRole: (roomId: number | string) => new Endpoint(`/api/room/${roomId}/role`, baseUrlMap.room),

    /** `DELETE` */
    deleteRole: (roomId: number | string, role: string) =>
      new Endpoint(`/api/room/${roomId}/role/${role}`, baseUrlMap.room),
  },

  participant: {
    /** `PUT` */
    add: (roomId: number | string) =>
      new Endpoint(`/api/room/${roomId}/participants`, baseUrlMap.room),

    /** `PATCH` */
    update: (roomId: number | string, participantId: UUID) =>
      new Endpoint(
        `/api/room/${roomId}/participants/${participantId}, baseUrlMap.room)`,
        baseUrlMap.room,
      ),

    /** `DELETE` */
    delete: (roomId: number | string, participantId: UUID) =>
      new Endpoint(`/api/room/${roomId}/participants/${participantId}`, baseUrlMap.room),

    /** `GET` */
    getRoomByParticipant: (participantId: UUID) =>
      new Endpoint(`/api/room/participants/${participantId}`, baseUrlMap.room),
  },

  vote: {
    /** `POST` */
    create: (roomId: number | string) => new Endpoint(`/api/vote/${roomId}`, baseUrlMap.vote),

    /** `GET` */
    getInfo: (roomId: number | string) => new Endpoint(`/api/vote/${roomId}`, baseUrlMap.vote),

    /** `GET` */
    getDetail: (voteId: number | string) =>
      new Endpoint(`/api/vote/${voteId}/detail`, baseUrlMap.vote),

    /** `POST` */
    updateStatus: (voteId: number | string, status: VoteStatus) =>
      new Endpoint(`/api/vote/${voteId}/${status}`, baseUrlMap.vote),

    /** `PUT` */
    submit: (voteId: number | string) => new Endpoint(`/api/vote/${voteId}`, baseUrlMap.vote),

    /** `POST` */
    reset: (voteId: number | string) => new Endpoint(`/api/vote/${voteId}/reset`, baseUrlMap.vote),
  },

  sse: {
    /** `GET` */
    connect: (roomId: number | string, userId: UUID) =>
      new Endpoint(`/sse/room/${roomId}/${userId}`, baseUrlMap.sse),
  },
} as const;

const baseUrlMap = {
  room: process.env.NEXT_PUBLIC_ROOM_SERVER_HOST ?? "",
  participant: process.env.NEXT_PUBLIC_ROOM_SERVER_HOST ?? "",
  vote: process.env.NEXT_PUBLIC_VOTE_SERVER_HOST ?? "",
  sse: process.env.NEXT_PUBLIC_SSE_SERVER_HOST ?? "",
} satisfies Record<keyof typeof Endpoints, string>;
