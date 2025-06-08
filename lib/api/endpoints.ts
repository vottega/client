import { VoteStatus } from "@/lib/api/types/vote-service.dto";
import { UUID } from "crypto";

class Endpoint {
  endpoint: string;
  base?: string;

  constructor(endpoint: string, base?: string) {
    this.endpoint = endpoint;
    this.base = base;
  }

  get path() {
    return this.endpoint;
  }

  toFullPath() {
    if (this.base) {
      return new URL(this.endpoint, this.base).toString();
    }
    return this.endpoint;
  }
}

export const Endpoints = {
  room: {
    /** `POST` */
    create: () => new Endpoint("/api/room"),

    /** `GET` */
    get: (roomId: number | string) => new Endpoint(`/api/room/${roomId}`),

    /** `PATCH` */
    update: (roomId: number | string) => new Endpoint(`/api/room/${roomId}`),

    /** `GET` */
    listByUser: () => new Endpoint(`/api/room/list`),

    /** `PUT` */
    addRole: (roomId: number | string) => new Endpoint(`/api/room/${roomId}/role`),

    /** `DELETE` */
    deleteRole: (roomId: number | string, role: string) =>
      new Endpoint(`/api/room/${roomId}/role/${role}`),
  },

  participant: {
    /** `PUT` */
    add: (roomId: number | string) => new Endpoint(`/api/room/${roomId}/participants`),

    /** `PATCH` */
    update: (roomId: number | string, participantId: UUID) =>
      new Endpoint(`/api/room/${roomId}/participants/${participantId})`, baseUrlMap.room),

    /** `DELETE` */
    delete: (roomId: number | string, participantId: UUID) =>
      new Endpoint(`/api/room/${roomId}/participants/${participantId}`),

    /** `GET` */
    getRoomByParticipant: (participantId: UUID) =>
      new Endpoint(`/api/room/participants/${participantId}`),
  },

  vote: {
    /** `POST` */
    create: (roomId: number | string) => new Endpoint(`/api/vote/${roomId}`),

    /** `GET` */
    getInfo: (roomId: number | string) => new Endpoint(`/api/vote/${roomId}`),

    /** `GET` */
    getDetail: (voteId: number | string) => new Endpoint(`/api/vote/${voteId}/detail`),

    /** `POST` */
    updateStatus: (voteId: number | string, status: VoteStatus) =>
      new Endpoint(`/api/vote/${voteId}/${status}`),

    /** `PUT` */
    submit: (voteId: number | string) => new Endpoint(`/api/vote/${voteId}`),

    /** `POST` */
    reset: (voteId: number | string) => new Endpoint(`/api/vote/${voteId}/reset`),
  },

  sse: {
    /** `GET` - For room owner connection */
    connect: (roomId: number | string) => new Endpoint(`/api/sse/room/${roomId}`),

    /** `GET` - For participant connection */
    connectParticipant: () => new Endpoint(`/api/sse/room`),

    /** `GET` - For local development participant connection */
    connectLocal: (roomId: number | string, participantId: UUID) =>
      new Endpoint(`/api/sse/room/${roomId}/${participantId}`),
  },

  user: {
    /** `POST` */
    create: () => new Endpoint("/api/user"),

    /** `POST` */
    checkUserId: () => new Endpoint("/api/user/check/userId"),

    /** `POST` */
    checkEmail: () => new Endpoint("/api/user/check/email"),

    /** `POST` */
    validateCode: () => new Endpoint("/api/user/validate"),

    /** `POST` */
    sendEmail: () => new Endpoint("/api/user/send"),

    /** `POST` */
    login: () => new Endpoint("/api/user/login"),
  },

  auth: {
    /** `POST` */
    verify: () => new Endpoint("/api/auth/verify"),

    /** `POST` */
    authenticateParticipant: () => new Endpoint("/api/auth/participant"),

    /** `POST` */
    authenticateUser: () => new Endpoint("/api/auth/user"),
  },
} as const;

const baseUrlMap = {
  room: process.env.NEXT_PUBLIC_SERVER_HOST ?? "",
  participant: process.env.NEXT_PUBLIC_SERVER_HOST ?? "",
  vote: process.env.NEXT_PUBLIC_SERVER_HOST ?? "",
  sse: process.env.NEXT_PUBLIC_SERVER_HOST ?? "",
  user: process.env.NEXT_PUBLIC_SERVER_HOST ?? "",
  auth: process.env.NEXT_PUBLIC_SERVER_HOST ?? "",
} satisfies Record<keyof typeof Endpoints, string>;
