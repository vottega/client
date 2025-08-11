import { z } from "zod";

type UUID = string;

export const FractionSchema = z
  .object({
    /** 분자 */
    numerator: z.number().int(),
    /** 분모 */
    denominator: z.number().int(),
  })
  .refine((fraction) => fraction.denominator !== 0, {
    message: "분모는 0이 될 수 없습니다.",
    path: ["denominator"],
  });

export type FractionVO = z.infer<typeof FractionSchema>;

export const VoteSchema = z.object({
  agendaName: z.string().min(1, { message: "안건명을 입력해주세요." }),
  voteName: z.string().min(1, { message: "표결 내용을 입력해주세요." }),
  /** 의결정족수 */
  passRate: FractionSchema,
  isSecret: z.boolean().default(false).nullable(),
  reservedStartTime: z
    .string()
    .datetime({ message: "시작 시간을 입력해주세요.", local: true })
    .nullable(),
  minParticipantNumber: z
    .number()
    .int()
    .min(0, { message: "출석 필요 인원은 0명 이상입니다." })
    .nullable(),
  /** 의사정족수 */
  minParticipantRate: FractionSchema,
  startNow: z.boolean().default(true),
});

export interface VoteRequestDTO extends Omit<z.infer<typeof VoteSchema>, "startNow"> {}

export interface VoteStatusRequestDTO {
  status: VoteStatus;
}

export interface VoteResponseDTO {
  id: number;
  roomId: number;
  agendaName: string;
  voteName: string;
  status: VoteStatus;
  passRate: FractionVO;
  minParticipantNumber: number;
  minParticipantRate: FractionVO;
  reservedStartTime: string;
  isSecret: boolean;
  yesNum: number;
  noNum: number;
  /** 기권 */
  abstainNum: number;
  createdAt: string;
  result: VoteResult;
  startedAt: string | null;
  finishedAt: string | null;
  lastUpdatedAt: string | null;
}

export interface ParticipantIdName {
  id?: string;
  name: string;
}

export interface VoteDetailResponseDTO {
  id: number;
  agendaName: string;
  voteName: string;
  status: VoteStatus;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  passRate: FractionVO;
  minParticipantNumber: number;
  minParticipantRate: FractionVO;
  isSecret: boolean;
  result: VoteResult | null;
  yesList: ParticipantIdName[];
  noList: ParticipantIdName[];
  abstainList: ParticipantIdName[];
}

export interface VotePaperDTO {
  votePaperId: number;
  voteId: number;
  roomId: number;
  userId: UUID;
  userName: string;
  votePaperType: VotePaperType;
  createdAt: string;
  votedAt: string | null;
}

export interface VotePaperRequestDTO {
  voteId: number;
  participant: UUID;
  voteResultType: VotePaperType;
}

export type VoteStatus = "CREATED" | "STARTED" | "ENDED";

export type VoteResult = "PASSED" | "REJECTED" | "NOT_DECIDED";

export type VotePaperType = "YES" | "NO" | "ABSTAIN" | "NOT_VOTED";
