"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

// 🎟️ 트렌디한 예시 투표 데이터
const vote = {
  agendaName: "조직 개편안 승인",
  voteName: "2025년 상반기 조직 개편안",
  isSecret: true,
  reservedStartTime: "2025-05-24T09:23:22.086Z",
  passRate: { numerator: 2, denominator: 3 },
  minParticipantRate: { numerator: 1, denominator: 2 },
};

export function VotePaper() {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const formattedDate = format(new Date(vote.reservedStartTime), "yyyy.MM.dd HH:mm", {
    locale: ko,
  });

  const handleVote = () => {
    console.log("선택된 항목:", selectedOption);
    // TODO: 투표 결과 처리 로직 추가
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">투표하기</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* ✨ 개선된 Dialog Header with Emphasized Info */}
        <DialogHeader className="p-0">
          <div className="bg-gradient-to-tr from-lime-500 via-green-500 to-emerald-500 p-8">
            <DialogTitle className="text-2xl md:text-3xl font-extrabold text-white">
              {vote.agendaName}
            </DialogTitle>
            <p className="mt-2 text-lg md:text-xl text-white/90">{vote.voteName}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center bg-white bg-opacity-25 text-white text-sm md:text-base font-medium px-3 py-1.5 rounded-full">
                🕒 {formattedDate}
              </span>
              <span className="inline-flex items-center bg-white bg-opacity-25 text-white text-sm md:text-base font-medium px-3 py-1.5 rounded-full">
                {vote.isSecret ? "🔒 비밀투표" : "🔓 공개투표"}
              </span>
              <span className="inline-flex items-center bg-white bg-opacity-25 text-white text-sm md:text-base font-medium px-3 py-1.5 rounded-full">
                📊 가결조건 {vote.passRate.numerator}/{vote.passRate.denominator}
              </span>
              <span className="inline-flex items-center bg-white bg-opacity-25 text-white text-sm md:text-base font-medium px-3 py-1.5 rounded-full">
                👥 정족수 {vote.minParticipantRate.numerator}/{vote.minParticipantRate.denominator}
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* 🗳️ 본문: 선택 옵션 */}
        <div className="p-6 bg-white space-y-4">
          <p className="text-base text-gray-600">다음 중 하나를 선택하세요:</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "yes", label: "찬성" },
              { value: "no", label: "반대" },
              { value: "abstain", label: "기권" },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center justify-center p-5 border-2 rounded-xl cursor-pointer transition-colors
                  ${
                    selectedOption === opt.value
                      ? "bg-green-600 border-green-600 text-white"
                      : "border-gray-300 bg-gray-50 text-gray-700 hover:border-green-500 hover:bg-green-50"
                  }
                `}
              >
                <input
                  type="radio"
                  name="vote"
                  value={opt.value}
                  className="sr-only"
                  checked={selectedOption === opt.value}
                  onChange={() => setSelectedOption(opt.value)}
                />
                <span className="text-lg font-medium">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ✅ 푸터: 제출 버튼 */}
        <DialogFooter className="bg-white p-5">
          <Button className="w-full py-3" disabled={!selectedOption} onClick={handleVote}>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
