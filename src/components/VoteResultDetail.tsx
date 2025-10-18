import { useVoteDetail } from "@/lib/api/queries/vote";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  Clock,
  Users,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface VoteResultDetailProps {
  voteId: number;
}

export const VoteResultDetail = ({ voteId }: VoteResultDetailProps) => {
  const { data: voteDetail, isLoading } = useVoteDetail(voteId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-20 bg-muted animate-pulse rounded-lg" />
        <div className="h-40 bg-muted animate-pulse rounded-lg" />
        <div className="h-60 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!voteDetail) {
    return (
      <Alert variant="destructive">
        <AlertDescription>투표 정보를 불러올 수 없습니다.</AlertDescription>
      </Alert>
    );
  }

  const votedPapers = voteDetail.votePaperList.filter(
    (paper) => paper.votePaperType !== "NOT_VOTED",
  );
  const notVotedPapers = voteDetail.votePaperList.filter(
    (paper) => paper.votePaperType === "NOT_VOTED",
  );
  const totalParticipants = voteDetail.votePaperList.length;
  const attendanceCount = votedPapers.length;
  const attendanceRate = totalParticipants > 0 ? (attendanceCount / totalParticipants) * 100 : 0;

  const yesCount = votedPapers.filter((paper) => paper.votePaperType === "YES").length;
  const noCount = votedPapers.filter((paper) => paper.votePaperType === "NO").length;
  const abstainCount = votedPapers.filter((paper) => paper.votePaperType === "ABSTAIN").length;

  const yesPercentage = attendanceCount > 0 ? (yesCount / attendanceCount) * 100 : 0;
  const noPercentage = attendanceCount > 0 ? (noCount / attendanceCount) * 100 : 0;
  const abstainPercentage = attendanceCount > 0 ? (abstainCount / attendanceCount) * 100 : 0;

  const quorumRequired = Math.ceil(
    (totalParticipants * voteDetail.minParticipantRate.numerator) /
      voteDetail.minParticipantRate.denominator,
  );
  const quorumMet = attendanceCount >= quorumRequired;

  const passRequired = Math.ceil(
    (attendanceCount * voteDetail.passRate.numerator) / voteDetail.passRate.denominator,
  );
  const votePassed = yesCount >= passRequired;

  const getResultBadge = () => {
    if (voteDetail.result === "PASSED") {
      return (
        <Badge className="bg-green-500 hover:bg-green-600 text-white">
          <CheckCircle2 className="w-4 h-4 mr-1" />
          가결
        </Badge>
      );
    } else if (voteDetail.result === "REJECTED") {
      return (
        <Badge className="bg-red-500 hover:bg-red-600 text-white">
          <XCircle className="w-4 h-4 mr-1" />
          부결
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary">
          <MinusCircle className="w-4 h-4 mr-1" />
          미결정
        </Badge>
      );
    }
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "yyyy년 MM월 dd일 HH:mm:ss", { locale: ko });
    } catch {
      return dateString;
    }
  };

  const getVotePaperTypeBadge = (type: string) => {
    switch (type) {
      case "YES":
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">찬성</Badge>;
      case "NO":
        return <Badge className="bg-red-500 hover:bg-red-600 text-white">반대</Badge>;
      case "ABSTAIN":
        return <Badge variant="secondary">기권</Badge>;
      case "NOT_VOTED":
        return <Badge variant="outline">미참여</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 투표 결과 요약 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>투표 결과</CardTitle>
            {getResultBadge()}
          </div>
          <CardDescription>
            {voteDetail.isSecret && (
              <Badge variant="outline" className="mr-2">
                비공개 투표
              </Badge>
            )}
            {voteDetail.agendaName} - {voteDetail.voteName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 참석 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <Users className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">참석 인원</p>
                <p className="text-2xl font-bold">
                  {attendanceCount} / {totalParticipants}명
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  참석률: {attendanceRate.toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">의사정족수</p>
                <p className="text-2xl font-bold">
                  {voteDetail.minParticipantRate.numerator}/
                  {voteDetail.minParticipantRate.denominator}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  필요 인원: {quorumRequired}명 {quorumMet ? "✓ 충족" : "✗ 미충족"}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* 의결정족수 */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">의결정족수</p>
              <p className="text-lg font-bold">
                {voteDetail.passRate.numerator}/{voteDetail.passRate.denominator}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              가결 필요: {passRequired}표 / 현재 찬성: {yesCount}표{" "}
              {votePassed ? "✓ 통과" : "✗ 미통과"}
            </p>
          </div>

          <Separator />

          {/* 투표 시간 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">투표 시작</span>
              <span className="text-sm text-muted-foreground flex-1 text-right">
                {formatDateTime(voteDetail.startedAt)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">투표 종료</span>
              <span className="text-sm text-muted-foreground flex-1 text-right">
                {formatDateTime(voteDetail.finishedAt)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 투표 집계 */}
      <Card>
        <CardHeader>
          <CardTitle>투표 집계</CardTitle>
          <CardDescription>총 {attendanceCount}표</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 찬성 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                찬성
              </span>
              <span className="font-bold">
                {yesCount}표 ({yesPercentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="bg-green-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${yesPercentage}%` }}
              />
            </div>
          </div>

          {/* 반대 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                반대
              </span>
              <span className="font-bold">
                {noCount}표 ({noPercentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="bg-red-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${noPercentage}%` }}
              />
            </div>
          </div>

          {/* 기권 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium flex items-center gap-2">
                <MinusCircle className="w-4 h-4 text-gray-500" />
                기권
              </span>
              <span className="font-bold">
                {abstainCount}표 ({abstainPercentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="bg-gray-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${abstainPercentage}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 투표 세부 정보 */}
      {!voteDetail.isSecret && (
        <Card>
          <CardHeader>
            <CardTitle>투표 세부 정보</CardTitle>
            <CardDescription>참여자별 투표 내역</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>참여자</TableHead>
                    <TableHead>투표 결과</TableHead>
                    <TableHead className="text-right">투표 시간</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {voteDetail.votePaperList.map((paper, index) => (
                    <TableRow key={paper.votePaperId}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{paper.userName}</TableCell>
                      <TableCell>{getVotePaperTypeBadge(paper.votePaperType)}</TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {paper.votedAt
                          ? format(new Date(paper.votedAt), "HH:mm:ss", { locale: ko })
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {notVotedPapers.length > 0 && (
              <Alert className="mt-4">
                <AlertDescription>
                  미참여: {notVotedPapers.map((p) => p.userName).join(", ")} (
                  {notVotedPapers.length}명)
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {voteDetail.isSecret && (
        <Alert>
          <AlertDescription>
            비공개 투표이므로 개별 참여자의 투표 내역은 공개되지 않습니다.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
