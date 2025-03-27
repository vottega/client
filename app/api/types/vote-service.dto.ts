import { z } from "zod";

export const VoteSchema = z.object({
  agendaName: z.string().min(1, { message: "안건명을 입력해주세요." }),
  voteName: z.string().min(1, { message: "표결 내용을 입력해주세요." }),
  minParticipantNumber: z
    .number()
    .int()
    .min(0, { message: "출석 필요 인원은 0명 이상입니다." })
    .nullable(),
  minParticipantRate: z.string().min(2, { message: "의사정족수를 입력해주세요." }),
  passRate: z.string().min(2, { message: "의결정족수를 입력해주세요." }),
  reservedStartTime: z
    .string()
    .datetime({ message: "시작 시간을 입력해주세요.", local: true })
    .nullable(),
  startNow: z.boolean().default(true),
  isSecret: z.boolean().default(false).nullable(),
});

export type FractionVO = {
  numerator: number;
  denominator: number;
};

export interface VoteRequestDTO extends Omit<z.infer<typeof VoteSchema>, "passRate" | "startNow"> {
  passRateNumerator: number | null;
  passRateDenominator: number | null;
}

export interface Vote extends z.infer<typeof VoteSchema> {
  isFinished: boolean;
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
  /** UUID */
  userId: string;
  userName: string;
  votePaperType: VotePaperType;
  createdAt: string;
  votedAt: string | null;
}

export type VoteStatus = "CREATED" | "STARTED" | "ENDED";

export type VoteResult = "PASSED" | "REJECTED" | "NOT_DECIDED";

export type VotePaperType = "YES" | "NO" | "ABSTAIN" | "NOT_VOTED";
