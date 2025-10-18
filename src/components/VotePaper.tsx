import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSubmitVote } from "@/lib/api/queries/vote";
import type { VotePaperType, VoteResponseDTO } from "@/lib/api/types/vote-service.dto";
import { useHttpErrorHandler } from "@/lib/hooks/useHttpErrorHandler";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useCallback, useState } from "react";

export function VotePaper({ vote, className }: { vote: VoteResponseDTO; className?: string }) {
  const handleError = useHttpErrorHandler();
  const [selectedOption, setSelectedOption] = useState<VotePaperType>("NOT_VOTED");
  const [showVotePaper, setShowVotePaper] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const formattedDate = format(new Date(vote.reservedStartTime ?? ""), "yyyy.MM.dd HH:mm", {
    locale: ko,
  });
  const voteOptions: { value: VotePaperType; label: string }[] = [
    { value: "YES", label: "찬성" },
    { value: "NO", label: "반대" },
    { value: "ABSTAIN", label: "기권" },
  ];
  const { mutate: submitVote } = useSubmitVote(vote.id);

  const getVoteLabel = (type: VotePaperType) => {
    return voteOptions.find((opt) => opt.value === type)?.label || "";
  };

  const handleConfirmVote = useCallback(() => {
    submitVote(
      {
        voteResultType: selectedOption,
      },
      {
        onSuccess: () => {
          setShowVotePaper(false);
          setShowConfirm(false);
        },
        onError: (error) => {
          handleError(error);
        },
      },
    );
  }, [submitVote, selectedOption, handleError]);

  const handleVotePaperOpenChange = useCallback(
    (open: boolean) => {
      if (showConfirm && open === false) return;
      setShowVotePaper(open);
    },
    [showConfirm],
  );

  return (
    <>
      <Dialog open={showVotePaper} onOpenChange={handleVotePaperOpenChange}>
        <DialogTrigger asChild>
          <Button onClick={() => setShowVotePaper(true)} className={className}>
            투표하기
          </Button>
        </DialogTrigger>

        <DialogContent
          className="sm:max-w-md p-0 overflow-hidden"
          onInteractOutside={(e) => {
            if (showConfirm) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (showConfirm) e.preventDefault();
          }}
        >
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
                  👥 정족수 {vote.minParticipantRate.numerator}/
                  {vote.minParticipantRate.denominator}
                </span>
              </div>
            </div>
          </DialogHeader>

          {/* 🗳️ 본문: 선택 옵션 */}
          <div className="p-6 bg-white space-y-4">
            <p className="text-base text-gray-600">다음 중 하나를 선택하세요:</p>
            <div className="grid grid-cols-3 gap-4">
              {voteOptions.map((opt) => (
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
            <Button
              className="w-full py-3"
              disabled={selectedOption === "NOT_VOTED"}
              onClick={() => setShowConfirm(true)}
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>투표 확인</AlertDialogTitle>
            <AlertDialogDescription>
              {`"${vote.voteName}"에 "${getVoteLabel(selectedOption)}"로 투표하시겠습니까?`}
              <br />
              투표 후에는 변경할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmVote}>투표하기</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
