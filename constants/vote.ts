import { z } from "zod";

export const VoteSchema = z.object({
  agendaName: z.string().min(1, { message: "안건명을 입력해주세요." }),
  voteContent: z.string().min(1, { message: "표결 내용을 입력해주세요." }),
  requiredAttendance: z.number().int().min(0, { message: "출석 필요 인원은 0명 이상입니다." }),
  proceduralQuorum: z.string().min(2, { message: "의사정족수를 입력해주세요." }),
  votingQuorum: z.string().min(2, { message: "의결정족수를 입력해주세요." }),
  startTime: z.string().datetime({ message: "시작 시간을 입력해주세요.", local: true }),
  startNow: z.boolean().default(true),
  secretBallot: z.boolean().default(false),
});

export interface Vote extends z.infer<typeof VoteSchema> {
  isFinished: boolean;
}
